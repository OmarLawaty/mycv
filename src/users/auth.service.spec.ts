import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import type { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const fakeCreds = { email: 'john@doe.com', password: 'johndoe' };

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve(users.filter((user) => email === user.email)),
      create: (userCreds: { email: string; password: string }) => {
        const user = {
          id: Math.ceil(Math.random() * 999999),
          ...userCreds,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('can create a new user with a salted and hashed password', async () => {
      const user = await service.signup(fakeCreds);

      expect(user.password).not.toEqual('johndoe');

      const [salt, hash] = user.password.split('.');

      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throw an error if email is in use', async () => {
      await service.signup(fakeCreds);

      await expect(service.signup(fakeCreds)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signin', () => {
    it('can signin to user with correct password', async () => {
      await service.signup(fakeCreds);

      const user = await service.signin(fakeCreds);

      expect(user).toBeDefined();
    });

    it('throw an error if password is incorrect', async () => {
      await service.signup(fakeCreds);

      await expect(
        service.signin({ ...fakeCreds, password: 'password' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throw an error if email is not used', async () => {
      await expect(service.signin({ ...fakeCreds })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
