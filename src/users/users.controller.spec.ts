import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  const fakeCreds = { email: 'john@doe.com', password: 'johndoe' };

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => Promise.resolve({ id, ...fakeCreds } as User),
      find: (email: string) =>
        Promise.resolve([
          { id: 1, email, password: fakeCreds.password },
        ] as User[]),
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (creds: typeof fakeCreds) =>
        Promise.resolve({ id: 1, ...creds } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('return all users with given email', async () => {
    const users = await controller.getUsers(fakeCreds.email);

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].email).toEqual(fakeCreds.email);
  });

  it('return user with id', async () => {
    const user = await controller.getUser('1');

    expect(user).toBeDefined();
  });

  it('throw an error if no user was found', async () => {
    fakeUsersService.findOne = async () => null;

    await expect(controller.getUser('1')).rejects.toThrow(NotFoundException);
  });

  it('Signin updates session object and returns user', async () => {
    const session = { userId: null };
    const user = await controller.signin(fakeCreds, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
