import { errorsList, IDefaultError } from '../config';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { buildErrorResponseFromError, sendError } from '../responseBuilder';
import { DatabaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';

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
  private logger: Logger = new Logger('AllExceptions');

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
        responseBuilder = buildErrorResponseFromError(message);
        break;
      }
      case exception instanceof ProjectError: {
        const { error } = exception;
        status = error.status;
        responseBuilder = sendError(error.message, error.code);
        break;
      }
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        responseBuilder = buildErrorResponseFromError(exception.message);
      }
    }

    this.logger.error(JSON.stringify(responseBuilder));

    return response.status(status).json(responseBuilder);
  }
}

@Catch(DatabaseError, UniqueConstraintError, ForeignKeyConstraintError, ValidationError)
export class SequelizeExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger('SequelizeExceptionsFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status;
    let responseBuilder;
    switch (true) {
      case exception instanceof UniqueConstraintError: {
        status = 409;
        responseBuilder = buildErrorResponseFromError(exception.message);
        break;
      }
      // UUID Syntax Error
      case exception?.parent?.code === '22P02': {
        status = 400;
        responseBuilder = buildErrorResponseFromError('Validation failed (uuid  is expected)');
        break;
      }
      // Default Validation Error
      case exception instanceof ValidationError: {
        status = 400;
        responseBuilder = buildErrorResponseFromError(exception.message);
        break;
      }
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        responseBuilder = buildErrorResponseFromError(exception.message);
      }
    }

    this.logger.error(
      `${request.method} ${request.path} ${exception.name}: ${JSON.stringify(exception)}`,
      status === HttpStatus.INTERNAL_SERVER_ERROR && exception?.stack,
    );

    return response.status(status).json(responseBuilder);
  }
}
