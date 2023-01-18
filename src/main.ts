import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configuration } from './common/config';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
  });

  app.use(
    helmet({
      hidePoweredBy: true,
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      referrerPolicy: false,
      frameguard: false,
    }),
  );

  app.enableShutdownHooks();

  const options = new DocumentBuilder().setTitle('IvorySoft API').setDescription('IvorySoft API').setVersion('1.0.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configuration.server.port, () => {
    Logger.log(`API: http://${configuration.server.host}:${configuration.server.port}`, 'APP');
    Logger.log(`Swagger: http://${configuration.server.host}:${configuration.server.port}/api-docs/#`, 'APP');
  });
}

bootstrap();
