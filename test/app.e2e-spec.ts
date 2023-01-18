import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import testingModule from './fixtures/testingModule';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let server: INestApplication;
  let appService: AppService;

  beforeEach(async () => {
    const { app, module } = await testingModule();

    await app.init();
    server = app.getHttpServer();
    appService = module.get(AppService);
  });

  it('/ (GET)', async () => {
    const response = await request(server).get('/').expect(HttpStatus.OK);
    expect(response.body.data).toBe(appService.getHello());
  });
});
