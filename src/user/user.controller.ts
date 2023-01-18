import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { ResponseBuilder, sendSuccess } from '../common/responseBuilder';
import { UserWithTokens } from '../common/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.model';

@ApiTags('Users')
@Controller('users')
export class UserController {
  private logger: Logger = new Logger('UserController');

  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'This should register new user',
    description: 'This is for registration the new user requires name, email, and password',
  })
  @ApiCreatedResponse({
    description: 'Created',
    content: {
      'application/json': {
        example: sendSuccess(UserWithTokens),
      },
    },
  })
  @Post('')
  @ResponseBuilder(HttpStatus.CREATED)
  public async registerUser(@Req() req, @Body() newUser: RegisterUserDto) {
    this.logger.log(`${req.method} ${req.url} register new user body: ${JSON.stringify(newUser)}`);
    const user: User = await this.userService.create(newUser);

    const [token, refreshToken] = [this.authService.getAuthToken(user.id), this.authService.getRefreshToken(user.id)];

    return {
      user: user.publicFields(),
      token,
      refreshToken,
    };
  }
}
