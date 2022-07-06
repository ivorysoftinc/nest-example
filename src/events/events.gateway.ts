import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import WebSocket, { Server } from 'ws';
import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { configuration } from '../config/configuration';
import { EventsService } from './events.service';
import { WebsocketExceptionsFilter } from '../filters/websocket-exceptions.filter';
import { WsValidationPipe } from '../pipes/ws-validation.pipe';
import { WsThrottlerGuard } from '../throttle-guards/ws-throttler-guard';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis/built/Redis';
import { EventActions } from './enums/eventActions.enum';
import { GetUserInfoDto } from './dto/get-user-info.dto';

const {
  server: { memoryDebug, wsUrl },
} = configuration;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(
  new WsThrottlerGuard(
    {
      ttl: 60,
      limit: 60,
    },
    new ThrottlerStorageRedisService(
      new Redis({
        host: configuration.redis.host,
        port: configuration.redis.port,
      }),
    ) as any,
    new Reflector(),
  ),
)
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(WsValidationPipe)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger;

  constructor(private readonly eventsService: EventsService) {
    this.logger = new Logger('WsGateway');
  }

  afterInit(server: Server) {
    this.logger.log(`Socket-server up at: ${wsUrl}`);
    if (memoryDebug) {
      setInterval(() => {
        let used = process.memoryUsage().heapUsed / 1024 / 1024;
        this.logger.log(
          `RAM: ${Math.round(used * 100) / 100}. QUEUE: ${
            Object.keys(this.eventsService.getSockets()).length
          }`,
        );
      }, 5000);
    }
  }

  handleConnection(socket: WebSocket, request, ...args: any[]) {
    this.eventsService.addSocket(socket, request);
  }

  async handleDisconnect(socket: WebSocket): Promise<any> {
    await this.eventsService.close(socket.id);
  }

  @SubscribeMessage(EventActions.GetUserInfo)
  async handleEventInit(
    @MessageBody() data: GetUserInfoDto,
    @ConnectedSocket() client: WebSocket,
  ): Promise<Record<string, string>> {
    const userInfo = this.eventsService.getUserInfo(client, data);

    return userInfo;
  }
}
