import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseBuilder, sendSuccess } from './common/responseBuilder';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Root Endpoint' })
  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        example: sendSuccess(AppService.helloText),
      },
    },
  })
  @Get()
  @ResponseBuilder()
  public root() {
    return this.appService.getHello();
  }
}
