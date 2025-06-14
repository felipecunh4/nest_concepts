/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// vai ser um pipe que se importado no main.ts, será rodado em todos os controllers
// validando se existe na request existe um param, e se esse param é um id
// ele pode tambem ser importado dentro de um controller para rodar só em 1 controller
// ou pode colocar somente no método desejada
@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('ParseIntIdPipe: Param ID is not a number');
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        'ParseIntIdPipe: Param ID must be bigger than 0',
      );
    }

    return parsedValue;
  }
}
