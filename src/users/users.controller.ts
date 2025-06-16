import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { Request } from 'express';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenUserPayloadDTO } from 'src/auth/dto/token-payload.dto';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { ERoutePolicies } from 'src/auth/enums/route-policies.enum';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SetRoutePolicy(ERoutePolicies.admin)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Post('/create-clone')
  createClone(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ChangeDataInterceptor, AuthTokenInterceptor)
  @UseGuards(IsAdminGuard)
  findAll(@Req() req: Request) {
    console.log(
      '[UserController] Getting user on request header...',
      req['user'],
    );
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: TokenUserPayloadDTO,
  ) {
    return this.usersService.update(id, updateUserDto, tokenPayload);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenUserPayloadDTO,
  ) {
    return this.usersService.remove(id, tokenPayload);
  }
}
