import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      // feito dessa forma pq se precisar mudar o serviço de criptografia, vai precisar somente:
      // criar uma nova class que extende do HashingService e colocar no lugar do Bcrypt
      // dessa forma previne que tenha que fazer alteração em diversos arquivos do projeto
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingService, JwtModule, ConfigModule, TypeOrmModule],
})
export class AuthModule {}
