import { buildErrorResponseFromError } from '../responseBuilder';
import { Role } from '../roles';

export const UnauthorizedExample = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      example: buildErrorResponseFromError('error1002'),
    },
  },
};
export const ForbiddenExample = {
  description: 'Forbidden Resource',
  content: {
    'application/json': {
      example: buildErrorResponseFromError('error1001'),
    },
  },
};

export const UserObject = {
  id: '9fbeee4c-6d22-4854-ae3f-5484bde14691',
  name: 'SomeUser',
  email: 'a@mail.ua',
  role: Role.SuperAdmin,
};
export const TokensObject = {
  token: 'sdfghjdfghjk...',
  refreshToken: 'sdfghjkjhgfghj...',
};
export const UserWithTokens = {
  user: UserObject,
  ...TokensObject,
};
