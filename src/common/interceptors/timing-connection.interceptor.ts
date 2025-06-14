import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    console.log('[TimingConnectionInterceptor] Executing...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // a função 'pipe()' serve pra utilizar algumas funções, por exemplo:
    // funções para logar coisas após a chamada do metódo
    // funções para modificar ou observar coisas
    return next.handle().pipe(
      // função usada quando não vamos manipular dados, apenas para observar
      tap(() => {
        const finalTime = Date.now();
        const timeDiff = finalTime - startTime;

        console.log(
          `[TimingConnectionInterceptor] Request execution time: ${timeDiff}ms`,
        );
      }),
    );
  }
}
