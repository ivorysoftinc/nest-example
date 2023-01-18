import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration } from './common/config';
import { AllExceptionsFilter, SequelizeExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JsonBodyMiddleware, UrlencodedMiddleware } from './common/middlewares';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Redis } from 'ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      ...configuration.postgres,
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
      },
      logging: false,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: configuration.redis.host,
          port: configuration.redis.port,
        }),
      ),
    }),
    AuthModule,
    UserModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SequelizeExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonBodyMiddleware).forRoutes('*').apply(UrlencodedMiddleware).forRoutes(AppController);
  }
}
