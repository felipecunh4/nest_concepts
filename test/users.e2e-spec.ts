import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import appConfig from 'src/app/config/app.config';
import globalConfig from 'src/global-config/global-config';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { MessageModule } from 'src/message/message.module';
import { UsersModule } from 'src/users/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing', // ATENÇÃO
          password: '123456',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        MessageModule,
        UsersModule,
        GlobalConfigModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    //
  });
});
