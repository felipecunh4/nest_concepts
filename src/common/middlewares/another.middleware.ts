import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AnotherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('[AnotherMiddleware] Executing...');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'my',
        sobrenome: 'name',
      };
    }

    res.setHeader('new-header', 'my middleware');

    // Terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });

    next();

    console.log('[AnotherMiddleware] Ending...');
  }
}
