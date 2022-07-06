import { Injectable } from '@nestjs/common';
import { ResponseBuilder } from './responseBuilder';
import { errorsList } from '../config/errorsList';

@Injectable()
export class ResponseBuilderService {
  sendSuccess(data): ResponseBuilder {
    const response = {
      result: true,
      error: {
        message: '',
        code: 0,
      },
      data,
    };
    return response;
  }

  sendError(message, code): ResponseBuilder {
    const response = {
      result: false,
      error: {
        message,
        code,
      },
      data: {},
    };
    return response;
  }

  buildErrorResponseFromError(errorMessage: string): ResponseBuilder {
    if (errorsList[errorMessage]) {
      return this.sendError(errorsList[errorMessage].message, errorsList[errorMessage].code);
    }
    return this.sendError(`${errorsList.error1000.message} ${errorMessage}`, errorsList.error1000.code);
  }
}

export const SwaggerResponseBuilder = new ResponseBuilderService();
