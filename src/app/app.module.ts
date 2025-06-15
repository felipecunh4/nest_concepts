import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from '../message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { SimpleMiddleware } from '../common/middlewares/simple.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from '../common/exception-filters/my-exception.filter';
import { ErrorExceptionFilter } from '../common/exception-filters/error-exception.filter';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [appConfig], // carregar variaveis globais
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
        DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
      }),
    }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      // para configurações por módulo/parciais, utilizar o forFeature
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => {
        return {
          type: config.database.type,
          host: config.database.host,
          port: config.database.port,
          username: config.database.username,
          password: config.database.password,
          autoLoadEntities: config.database.autoLoadEntities,
          synchronize: config.database.synchronize,
        };
      },
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
    // consumer.apply(AnotherMiddleware).forRoutes({
    //   path: '*',
    //   method: RequestMethod.ALL,
    // });
  }
}
