import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import { ProjectError } from '../common/filters/all-exceptions.filter';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  public async validate(email: string, password: string): Promise<User> {
    try {
      const user: Nullable<User> = await this.authService.validateUser(email, password);
      if (!user.id) throw new ProjectError(1002);
      return user;
    } catch (err) {
      throw new ProjectError(1002);
    }
  }
}
