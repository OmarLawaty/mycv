import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication<App>;
  const fakeCreds = { email: 'john1@doe.com', password: 'Johndoe@123' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(fakeCreds)
      .expect(201)
      .then(({ body }) => {
        const { id, email } = body;

        expect(id).toBeDefined();
        expect(email).toEqual(fakeCreds.email);
      });
  });

  it('signup as new user and then get the  currently logged in user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(fakeCreds)
      .expect(201);

    const cookie: string[] = res.get('Set-Cookie') ?? [];

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(fakeCreds.email);
  });
});
