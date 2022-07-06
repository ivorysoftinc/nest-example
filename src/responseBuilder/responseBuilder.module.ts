import { Module } from '@nestjs/common';
import { ResponseBuilderService } from './responseBuilder.service';

@Module({
  imports: [],
  providers: [ResponseBuilderService],
  exports: [ResponseBuilderService],
})
export class ResponseBuilderModule {}
