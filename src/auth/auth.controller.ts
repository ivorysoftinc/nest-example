import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TokensObject, UserObject, UserWithTokens } from '../common/swagger';
import { ResponseBuilder, sendSuccess } from '../common/responseBuilder';
import { RefreshTokenBodyDto, TokenHeadersDto } from './dto/refresh-token.dto';
import { configuration } from '../common/config';
import { ProjectError } from '../common/filters/all-exceptions.filter';
import { User } from '../user/user.model';
import { Auth } from './auth.decorator';
import { UserRequest } from '../user/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RequestHeaders } from '../common/helpers';
import { IJwtPayload } from './auth.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Email and password login user' })
  @ApiOkResponse({
    description: 'New tokens successfully created',
    content: {
      'application/json': {
        example: sendSuccess(UserWithTokens),
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post()
  @ResponseBuilder()
  public async login(@UserRequest() user: User, @Body() {}: LoginDto) {
    const token = this.authService.getAuthToken(user.id);
    const refreshToken = this.authService.getRefreshToken(user.id);

    return {
      user: user.publicFields(),
      token,
      refreshToken,
    };
  }

  @ApiOperation({
    summary: 'Refresh jwt token',
    description: 'Accept expired token in the req.headers.authorization and the refreshToken in req.body',
  })
  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        example: sendSuccess(TokensObject),
      },
    },
  })
  @ApiBearerAuth()
  @ResponseBuilder()
  @Post('/refresh')
  public async refreshToken(@RequestHeaders() { authorization }: TokenHeadersDto, @Body() { refreshToken }: RefreshTokenBodyDto) {
    const oldAuthToken = authorization.split(' ')[1];
    const decoded: IJwtPayload = this.authService.decodeJWT(oldAuthToken, configuration.jwt.secret, true);
    const decodedRefresh: IJwtPayload = this.authService.decodeJWT(refreshToken, configuration.jwt.refreshSecret);
    if (!decoded.id || !decodedRefresh.id || decoded.id !== decodedRefresh.id) throw new ProjectError(1002);
    const user: Nullable<User> = await this.userService.findOne({
      id: decoded.id,
    });
    if (!user) throw new ProjectError(1002);
    const [token, newRefreshToken] = [this.authService.getAuthToken(user.id), this.authService.getRefreshToken(user.id)];
    return {
      refreshToken: newRefreshToken,
      token,
    };
  }

  @ApiOperation({
    summary: 'Get my profile by token',
  })
  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        example: sendSuccess(UserObject),
      },
    },
  })
  @Auth()
  @ResponseBuilder()
  @Get('/me')
  public async getMe(@UserRequest() user: User) {
    return user.publicFields();
  }
}
