import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenUserPayloadDTO } from 'src/auth/dto/token-payload.dto';
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  // teste de como faz pra alterar o codigo http do retorno da request
  @HttpCode(HttpStatus.CREATED)
  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    console.log('[MessageController] Executing findAll...');
    return this.messageService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messageService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post('create')
  create(
    @Body() payload: CreateMessageDTO,
    @TokenPayloadParam() tokenPayload: TokenUserPayloadDTO,
  ) {
    return this.messageService.create(payload, tokenPayload);
  }

  // no update, existe uma diferença entre PATCH e PUT
  // PATCH atualiza algum valor de um objeto, como se fosse um "remendo"
  // PUT atualiza o objeto INTEIRO, assim precisando de todas as infos no payload da req
  @UseGuards(AuthTokenGuard)
  @Patch('update/:id')
  udpate(
    @Param('id') id: number,
    @Body() payload: UpdateMessageDTO,
    @TokenPayloadParam() tokenPayload: TokenUserPayloadDTO,
  ) {
    return this.messageService.update(id, payload, tokenPayload);
  }

  // ParseInPipe e outros tipos de pipe é a alternativa caso o transform não for true no main.ts
  @UseGuards(AuthTokenGuard)
  @Delete('delete/:id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenUserPayloadDTO,
  ) {
    return this.messageService.remove(id, tokenPayload);
  }
}
