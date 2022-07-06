import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [],
  providers: [EventsService, EventsGateway],
  exports: [EventsService],
})
export class EventsModule {}
