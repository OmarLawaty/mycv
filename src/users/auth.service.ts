import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import type { CreateUserDTO } from './dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(credentials: CreateUserDTO) {
    const user = await this.usersService.find(credentials.email);

    if (user.length) throw new BadRequestException('Email is already used');

    const salt = randomBytes(8).toString('hex');
    const hashed = (await scrypt(credentials.password, salt, 32)) as Buffer;
    const result = `${salt}.${hashed.toString('hex')}`;

    return this.usersService.create({ ...credentials, password: result });
  }

  async signin(credentials: CreateUserDTO) {
    const [user] = await this.usersService.find(credentials.email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, hash] = user.password.split('.');

    const userHash = (await scrypt(credentials.password, salt, 32)) as Buffer;

    if (hash !== userHash.toString('hex'))
      throw new BadRequestException('Password is incorrect');

    return user;
  }
}
