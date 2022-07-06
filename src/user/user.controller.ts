import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  Headers,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { User } from './user.model';
import { AuthService } from '../auth/auth.service';
import {
  ResponseBuilderService,
  SwaggerResponseBuilder,
} from '../responseBuilder/responseBuilder.service';
import { Request, Response } from 'express';
import { UserObjectPublic } from '../config/swagger-examples';

@ApiTags('Users')
@Controller('users')
export class UserController {
  private logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {
    this.logger = new Logger('UserController');
  }

  @ApiOperation({
    summary: 'This should register new user',
    description:
      'This is for registration the new user requires name, email, and password',
  })
  @ApiCreatedResponse({
    description: 'Created',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess({
          user: UserObjectPublic,
        }),
      },
    },
  })
  @Post('')
  async registerUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() newUser: RegisterUserDto,
  ): Promise<Response> {
    this.logger.log(
      `${req.method} ${req.url} register new user body: ${JSON.stringify(
        newUser,
      )}`,
    );
    const user: User = await this.userService.create(newUser);

    const [token, refreshToken] = [
      this.authService.getAuthToken(user.id),
      this.authService.getRefreshToken(user.id),
    ];

    return res.status(HttpStatus.CREATED).json(
      this.responseBuilderService.sendSuccess({
        user: user.publicFields(),
        token,
        refreshToken,
      }),
    );
  }
}
