import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from '../../src/app.module';

export default async function testingModule() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: 'SEQUELIZE',
        useFactory: async (sequelize: Sequelize) => {
          return sequelize;
        },
        inject: [getConnectionToken()],
      },
    ],
  }).compile();

  const app: INestApplication = module.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableShutdownHooks();

  const sequelize = app.get(getConnectionToken());

  return {
    module,
    app,
    sequelize,
  };
}
