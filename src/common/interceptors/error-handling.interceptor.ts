/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

// esse interceptor não tem nenhuma aplicação lógica
// ele só está aqui pra mostrar como usar o catchError e throwError
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('[ErrorHandlingInterceptor] Executing...');

    // await new Promise(resolve => setTimeout(resolve, 5000));

    return next.handle().pipe(
      // função pra lidar com algum erro
      catchError(error => {
        if (error.name === 'NotFoundException') {
          return throwError(() => new BadRequestException(error.message));
        }

        return throwError(
          () =>
            new BadRequestException(
              '[ErrorHandlingInterceptor] An unkown error occurred',
            ),
        );
      }),
    );
  }
}
