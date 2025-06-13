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

interface IMessagePayload {
  text: string;
  author: string;
}

interface IGetMessageParams {
  limit?: string;
  offset?: string;
}

@Controller('message')
export class MessageController {
  // teste de como faz pra alterar o codigo http do retorno da request
  @HttpCode(HttpStatus.CREATED)
  @Get()
  findAll(@Query() queryString: IGetMessageParams) {
    const { limit = 10, offset = 0 } = queryString;
    return `all my messages. limit is ${limit} on offset ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `a message with id: ${id}`;
  }

  @Post('create')
  create(@Body() payload: IMessagePayload) {
    return `my author is ${payload.author}, \nthe text is: ${payload.text}`;
  }

  // no update, existe uma diferença entre PATCH e PUT
  // PATCH atualiza algum valor de um objeto, como se fosse um "remendo"
  // PUT atualiza o objeto INTEIRO, assim precisando de todas as infos no payload da req
  @Patch('update/:id')
  udpate(@Param('id') id: string, @Body() payload: Partial<IMessagePayload>) {
    return `the new value of ${id} is: ${JSON.stringify(payload)}`;
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return `delete id: ${id}`;
  }
}
