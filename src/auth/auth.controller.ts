import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() payload: LoginDTO) {
    return this.authService.login(payload);
  }

  @Post('refresh')
  refreshTokens(@Body() payload: RefreshTokenDTO) {
    return this.authService.refreshTokens(payload);
  }
}
