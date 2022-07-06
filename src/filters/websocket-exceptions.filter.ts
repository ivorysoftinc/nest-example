import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { EventActions } from '../events/enums/eventActions.enum';

@Catch()
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  private logger: Logger;

  constructor() {
    super();
    this.logger = new Logger('WsExceptions');
  }
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error = exception instanceof WsException ? exception.getError() : exception.message;
    const details = error instanceof Object ? { ...error } : { message: error };
    this.logger.error(`WebSocket ID ${(client as any).id}: ${details.message}`);
    client.send(
      JSON.stringify({
        event: EventActions.Error,
        data: {
          id: (client as any).id,
          rid: data.rid,
          ...details,
        },
      }),
    );
    client.close();
  }
}

