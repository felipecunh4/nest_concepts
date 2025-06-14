import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('[SimpleMiddleware] Executing...');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'my',
        sobrenome: 'name',
      };
    }

    // if (authorization) {
    //   throw new BadRequestException('Bla bla');
    // }

    res.setHeader('new-header', 'my middleware');

    // Terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });

    next(); // Próximo middleware

    console.log('[SimpleMiddleware] Ending...');

    res.on('finish', () => {
      console.log('[SimpleMiddleware] Finished');
    });
  }
}
