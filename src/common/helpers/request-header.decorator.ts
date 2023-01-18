import { applyDecorators, BadRequestException, createParamDecorator, ExecutionContext, Headers } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

interface IRequestHeadersOptions {
  validationClass?: ClassConstructor<any>;
}

export const HeadersValidate = createParamDecorator(async ({ validationClass }: IRequestHeadersOptions, ctx: ExecutionContext) => {
  const headers = ctx.switchToHttp().getRequest().headers;

  const dto = plainToClass(validationClass, headers);

  const errors: ValidationError[] = await validate(dto, { whitelist: true });

  if (errors.length > 0) {
    const validationErrors = errors.map((obj) => Object.values(obj.constraints));
    throw new BadRequestException(validationErrors);
  }

  return dto;
});

export function RequestHeaders(options: IRequestHeadersOptions = {}): Function {
  const ValidationClassReference = (target: Function, key: string, index: number) => {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);
    options.validationClass = paramTypes[index];
  };

  const decorators = [ValidationClassReference, Headers(), HeadersValidate(options)];

  return applyDecorators(...(decorators as Array<ClassDecorator | MethodDecorator | PropertyDecorator>));
}
