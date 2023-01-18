import { ResponseBuilderType } from './responseBuilder.types';
import { errorsList } from '../config';

export function sendSuccess(data: any): ResponseBuilderType {
  return {
    result: true,
    error: null,
    data,
  };
}

export function sendError(message: string, code: number): ResponseBuilderType {
  return {
    result: true,
    error: {
      message,
      code,
    },
    data: null,
  };
}

export function buildErrorResponseFromError(errorMessage: string): ResponseBuilderType {
  if (errorsList[errorMessage]) {
    return sendError(errorsList[errorMessage].message, errorsList[errorMessage].code);
  }
  return sendError(`${errorsList.error1000.message} ${errorMessage}`, errorsList.error1000.code);
}
