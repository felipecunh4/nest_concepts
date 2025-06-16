import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  readonly text: string;

  @IsPositive()
  readonly toId: number;
}
