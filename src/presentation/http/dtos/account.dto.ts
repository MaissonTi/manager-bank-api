import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountCreateInputDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document: string;
}

export class AccountUpdateInputDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class AccountOutputDTO {
  @ApiProperty({ example: 999 })
  id: number;

  @ApiProperty({ example: 'Maisson Saraiva Moreira' })
  name: string;

  @ApiProperty({ example: '09476025481' })
  document: string;

  @ApiProperty({ example: 100 })
  balance: number;
}
