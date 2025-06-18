import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // carrega as entidades sem precisar especifica-las
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // sincroniza com o DB. NÃO deve ser usado em PROD
  },
  environment: process.env.NODE_ENV || 'development',
}));
