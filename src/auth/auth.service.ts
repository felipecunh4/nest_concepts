/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { TokenPayloadDTO } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    console.log(jwtConfiguration);
  }

  private async signJwtAsync<T>(id: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: id,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  private async createTokens(user: User) {
    const accessTokenPromise = this.signJwtAsync<Partial<User>>(
      user.id,
      Number(this.jwtConfiguration.ttl),
      {
        email: user.email,
      },
    );

    const refreshTokenPromise = this.signJwtAsync(
      user.id,
      Number(this.jwtConfiguration.refreshTtl),
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { accessToken, refreshToken };
  }

  async login(payload: LoginDTO) {
    const user = await this.userRepository.findOneBy({
      email: payload.email,
      active: true,
    });

    if (!user) throw new UnauthorizedException('User not authorized');

    const password = await this.hashingService.compare(
      payload.password,
      user.passwordHash,
    );

    if (!password) throw new UnauthorizedException('Password is invalid');

    return this.createTokens(user);
  }

  async refreshTokens(payload: RefreshTokenDTO) {
    try {
      const { sub } = await this.jwtService.verifyAsync<TokenPayloadDTO>(
        payload.refreshToken,
        this.jwtConfiguration,
      );

      const user = await this.userRepository.findOneBy({
        id: sub,
        active: true,
      });

      if (!user) throw new Error('User not authorized');

      return this.createTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
}
