import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class UrlencodedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    bodyParser.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
  }
}
