import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { of, tap } from 'rxjs';

// esse interceptor não tem nenhuma aplicação lógica
// ele só demonstra como um interceptador de cache funcionaria
// ideal seria trabalhar com redis ou algo do tipo
@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('[SimpleCacheInterceptor] Executing...');
    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log('[SimpleCacheInterceptor] Getting data in cache', url);

      return of(this.cache.get(url));
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    return next.handle().pipe(
      tap(data => {
        this.cache.set(url, data);

        console.log('[SimpleCacheInterceptor] Saving data in cache', url);
      }),
    );
  }
}
