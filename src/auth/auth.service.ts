import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { configuration } from '../common/config';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { IJwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async validateUser(email: string, password: string): Promise<Nullable<User>> {
    const user = await this.userService.findOne({ email });
    if (!user || !user.password) return null;
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) return null;
    return user;
  }

  public decodeJWT(jwt, key, ignoreExpiration = false): IJwtPayload {
    return this.jwtService.verify<IJwtPayload>(jwt, {
      secret: key,
      ignoreExpiration,
    });
  }

  public getAuthToken(userId: string): string {
    const payload: IJwtPayload = { id: userId };
    return this.jwtService.sign(payload);
  }

  public getRefreshToken(userId: string): string {
    const payload: IJwtPayload = { id: userId };
    return this.jwtService.sign(payload, {
      secret: configuration.jwt.refreshSecret,
      expiresIn: '7d',
    });
  }
}
