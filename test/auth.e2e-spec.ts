import { INestApplication } from '@nestjs/common';
import testingModule from './fixtures/testingModule';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  let server: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const { app, module } = await testingModule();

    await app.init();
    server = app.getHttpServer();
    authService = module.get(AuthService);
  });

  it('POST /login', async () => {});
  it('POST /refresh', async () => {});
  it('GET /me', async () => {});
});
