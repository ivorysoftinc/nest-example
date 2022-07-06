import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configuration } from '../config/configuration';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email });
    if (!user || !user.password) return null;
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) return null;
    return user;
  }

  decodeJWT(
    jwt,
    key,
    ignoreExpiration = false,
  ): string | { [key: string]: any } {
    return this.jwtService.verify(jwt, { secret: key, ignoreExpiration });
  }

  getAuthToken(userId: string): string {
    const payload = { id: userId };
    return this.jwtService.sign(payload);
  }

  getRefreshToken(userId: string): string {
    const payload = { id: userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: configuration.jwt.jwtRefreshSecret,
      expiresIn: '7d',
    });
    return refreshToken;
  }
}
