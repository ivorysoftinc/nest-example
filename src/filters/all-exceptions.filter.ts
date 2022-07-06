import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { errorsList, IDefaultError } from '../config/errorsList';
import { UniqueConstraintError } from 'sequelize';

export class ProjectError extends Error {
  code: number;
  error: IDefaultError;
  constructor(code: number, descriptionMessage?: string) {
    super();
    this.code = code;
    if (errorsList[`error${code}`]) {
      const errorObject = errorsList[`error${code}`];
      this.error = errorObject;
      this.error.message = descriptionMessage ? `${errorObject.message} ${descriptionMessage}` : errorObject.message;
    } else {
      this.error = errorsList.error1000;
    }
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(readonly responseBuilderService: ResponseBuilderService) {
    this.logger = new Logger('AllExceptions');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error(`${request.method} ${request.path} Error: ${JSON.stringify(exception.message)}`);

    let status;
    let responseBuilder;
    switch (true) {
      case exception instanceof HttpException: {
        status = exception.getStatus();
        const message = exception?.response?.message ? exception.response.message : exception.message;
        responseBuilder = this.responseBuilderService.buildErrorResponseFromError(message);
        break;
      }
      case exception instanceof ProjectError: {
        const { error } = exception;
        status = error.status;
        responseBuilder = this.responseBuilderService.sendError(error.message, error.code);
        break;
      }
      case exception instanceof UniqueConstraintError: {
        const { error } = new ProjectError(1027, exception.original.constraint);
        status = error.status;
        responseBuilder = this.responseBuilderService.sendError(error.message, error.code);
        break;
      }
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        responseBuilder = this.responseBuilderService.buildErrorResponseFromError(exception.message);
      }
    }

    this.logger.error(JSON.stringify(responseBuilder));

    response.status(status).json(responseBuilder);
  }
}
