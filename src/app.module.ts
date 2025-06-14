import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { SimpleMiddleware } from './common/middlewares/simple.middleware';
import { AnotherMiddleware } from './common/middlewares/another.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from './common/exception-filters/my-exception.filter';
import { ErrorExceptionFilter } from './common/exception-filters/error-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      autoLoadEntities: true, // carrega as entidades sem precisar especifica-las
      synchronize: true, // sincroniza com o DB. NÃO deve ser usado em PROD
    }),
    MessageModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Os Exceptions Filters, Guards, Interceptors
    // são declarados dessa forma para que aconteça a injeção de dependencia
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // configuração do middleware no modulo principal
    // a ordem importa, o middleware será executado na ordem que está listado
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
    consumer.apply(AnotherMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
