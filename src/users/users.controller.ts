import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';

@Serialize(UserDTO)
@Controller()
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/auth/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/auth/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Post('auth/signup')
  async signup(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body);

    session.userId = user.id;
    return user;
  }

  @Post('auth/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body);

    session.userId = user.id;
    return user;
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    if (Number.isNaN(id)) throw new BadRequestException('invalid user id');
    const user = await this.userService.findOne(+id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get('user')
  getUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('user/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    if (Number.isNaN(id)) throw new Error('invalid user id');

    return this.userService.update(+id, body);
  }

  @Delete('user/:id')
  removeUser(@Param('id') id: string) {
    if (Number.isNaN(id)) throw new Error('invalid user id');

    return this.userService.remove(+id);
  }
}
