import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { getDesktopPlatform, getDeviceFromUserAgent } from '../common/helpers/userAgentHelper';
import { GetUserInfoDto } from './dto/get-user-info.dto';

let socketsExternalObjectLink;

@Injectable()
export class EventsService {
  sockets: Record<string, SingleSocket> = {};
  private logger: Logger;

  constructor() {
    this.logger = new Logger('WsGatewayService');
    socketsExternalObjectLink = this.sockets;
  }

  addSocket(socket: WebSocket, request: any) {
    const ss = new SingleSocket(socket, request);
    this.sockets[ss.id] = ss;
  }

  getSockets(): Record<string, SingleSocket> {
    return this.sockets;
  }

  async close(socketId: string) {
    this.removeSocket(socketId);
    this.logger.warn(`Socket ${socketId} is disconnected`);
  }

  async directClose(socketId: string) {
    if (!this.sockets[socketId]) return;
    this.sockets[socketId].socket.close();
    this.sockets[socketId].socket.close();
    this.removeSocket(socketId);
  }

  removeSocket(socketId: string) {
    delete this.sockets[socketId];
  }

  getSocket(socketId: string): SingleSocket | undefined {
    return this.sockets[socketId];
  }

  getUserInfo(socket: WebSocket, data: GetUserInfoDto): { device: string; platform: string; message: string } {
    const device = getDeviceFromUserAgent((socket as any).request.headers['user-agent'] || 'Unknown');
    const platform = getDesktopPlatform((socket as any).request.headers['user-agent'] || 'Unknown');
    return { device, platform, message: data.message };
  }

  sendMessage(socketId: string, message: string): SingleSocket | undefined {
    this.sockets[socketId]?.socket.send(message);
    return this.sockets[socketId];
  }
}

class SingleSocket {
  id;
  socket;
  currentActiveSessionId;

  constructor(socket, request) {
    const id = crypto.randomBytes(16).toString('hex');
    this.id = id;
    this.socket = socket;
    this.socket.id = id;
    this.socket.request = request;
  }
}
