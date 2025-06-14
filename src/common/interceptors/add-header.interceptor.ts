import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

// pode ser usado direto no main.ts, no controller ou no método
// execução dos interceptors vem antes dos pipes
@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log(
      '[AddHeaderInterceptor] Executing - adding X-Custom-Header to response',
    );
    const response = context.switchToHttp().getResponse<Response>();

    response.setHeader('X-Custom-Header', 'My custom header value');

    return next.handle();
  }
}
