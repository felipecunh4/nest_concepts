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
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

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

  @Post('create')
  create(@Body() payload: CreateMessageDTO) {
    return this.messageService.create(payload);
  }

  // no update, existe uma diferença entre PATCH e PUT
  // PATCH atualiza algum valor de um objeto, como se fosse um "remendo"
  // PUT atualiza o objeto INTEIRO, assim precisando de todas as infos no payload da req
  @Patch('update/:id')
  udpate(@Param('id') id: number, @Body() payload: UpdateMessageDTO) {
    return this.messageService.update(id, payload);
  }

  // ParseInPipe e outros tipos de pipe é a alternativa caso o transform não for true no main.ts
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.messageService.remove(id);
  }
}
