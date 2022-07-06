import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { configuration } from '../config/configuration';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration.jwt.jwtSecret,
    });
  }
  async validate(payload: any): Promise<User> {
    const user = await this.userService.findById(payload.id);
    if (!user.id) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
