import { applyDecorators, Header, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ResponseBuilderInterceptor } from './responseBuilder.interceptor';

export function ResponseBuilder(statusCode: HttpStatus = HttpStatus.OK) {
  return applyDecorators(HttpCode(statusCode), Header('Content-Type', 'application/json'), UseInterceptors(ResponseBuilderInterceptor));
}
