import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ForbiddenExample, UnauthorizedExample } from '../common/swagger';
import { Role, Roles, RolesGuard } from '../common/roles';
import { JwtAuthGuard } from './jwt-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function Auth(...roles: Role[]): MethodDecorator {
  const decorators: Array<MethodDecorator> = [ApiBearerAuth(), ApiUnauthorizedResponse(UnauthorizedExample)];

  if (roles.length) {
    decorators.push(Roles(...roles));
    decorators.push(ApiForbiddenResponse(ForbiddenExample));
    decorators.push(UseGuards(JwtAuthGuard, RolesGuard));
  } else {
    decorators.push(UseGuards(JwtAuthGuard));
  }

  return applyDecorators(...decorators);
}
