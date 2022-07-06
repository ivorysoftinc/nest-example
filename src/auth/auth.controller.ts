import {
  Body,
  Headers,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import {
  ResponseBuilderService,
  SwaggerResponseBuilder,
} from '../responseBuilder/responseBuilder.service';
import { Response } from 'express';
import { errorsList } from '../config/errorsList';
import { UserService } from '../user/user.service';
import {
  RefreshTokenBodyDto,
  RefreshTokenHeadersDto,
} from '../user/dto/refresh-token.dto';
import { configuration } from '../config/configuration';
import { ProjectError } from '../filters/all-exceptions.filter';
import { User } from '../user/user.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseBuilderService: ResponseBuilderService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Email and password login user' })
  @ApiResponse({
    status: 200,
    description: 'New tokens successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req,
    @Res() res,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    const { user } = req;

    const token = this.authService.getAuthToken(user.id);
    const refreshToken = this.authService.getRefreshToken(user.id);

    return res.status(HttpStatus.OK).json(
      this.responseBuilderService.sendSuccess({
        user,
        token,
        refreshToken,
      }),
    );
  }

  @ApiOperation({
    summary: 'This should refresh jwt token',
    description:
      'This is for refresh jwt token. Accept expired token in the req.headers.authorization and the refreshToken in req.body',
  })
  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess({
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0c2ZxcXNmcXNmNTY3ODkwIiwibmFtZSI6IkpvaGZzZnFzcWZuIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.0VG9hYUaRaI2vj0kqVp5NQDG6-7rJmPG5bEmcMqnVw0',
          refreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        }),
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendError(
          errorsList.error1012.message,
          errorsList.error1012.code,
        ),
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendError(
          errorsList.error1003.message,
          errorsList.error1003.code,
        ),
      },
    },
  })
  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() { authorization }: RefreshTokenHeadersDto,
    @Body() { refreshToken }: RefreshTokenBodyDto,
  ): Promise<Response> {
    const oldAuthToken = authorization.split(' ')[1];
    const decoded: any = this.authService.decodeJWT(
      oldAuthToken,
      configuration.jwt.jwtSecret,
      true,
    );
    const decodedRefresh: any = this.authService.decodeJWT(
      refreshToken,
      configuration.jwt.jwtRefreshSecret,
    );
    if (!decoded.id || !decodedRefresh.id || decoded.id !== decodedRefresh.id)
      throw new ProjectError(1012);
    const user: User = await this.userService.findOne({
      id: decoded.id,
    });
    if (!user) throw new ProjectError(1012);
    const [token, newRefreshToken] = [
      this.authService.getAuthToken(user.id),
      this.authService.getRefreshToken(user.id),
    ];
    return res.status(HttpStatus.OK).json(
      this.responseBuilderService.sendSuccess({
        refreshToken: newRefreshToken,
        token,
      }),
    );
  }

  @ApiOperation({ summary: 'Fetch my profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Fetch user by token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req, @Res() res) {
    const { user } = req;
    return res
      .status(HttpStatus.OK)
      .json(this.responseBuilderService.sendSuccess(user));
  }
}
