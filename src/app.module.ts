import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import Redis from 'ioredis';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import {User as UserModel} from './user/user.model';
import { EventsModule } from './events/events.module';
import { UserModule } from './user/user.module';
import { ResponseBuilderModule } from './responseBuilder/responseBuilder.module';

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: configuration.postgres.postgresHost,
      port: +configuration.postgres.postgresPort,
      username: configuration.postgres.postgresUser,
      password: configuration.postgres.postgresPassword,
      database: configuration.postgres.postgresDataBase,
      // quoteIdentifiers: true,
      autoLoadModels: true, // Create models automatically
      synchronize: true,
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
    EventsModule,
    UserModule,
    ResponseBuilderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
