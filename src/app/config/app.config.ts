import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

export default (app: INestApplication) => {
  console.log('Configurando o app...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // retornar erro quando a chave DTO não existir
      // se o transform: true, ele tenta trasnformar os tipos de dados recebidos nos params e DTOs
      // ex: um param espera receber um number ou boolean, mas por ser param vai ser sempre string
      // o transform vai tentar converter esse valor recebido pra tipagem que esperamos receber
      transform: false,
    }),
    new ParseIntIdPipe(),
  );
  return app;
};
