import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public static helloText = 'Welcome to API';

  public getHello(): string {
    return AppService.helloText;
  }
}
