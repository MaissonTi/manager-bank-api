import { TypeOperationsEnum } from '@/domain/enum/type-operations.enum';
import { TypeTransactionsEnum } from '@/domain/enum/type-transactions.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionInputDTO {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class TransferAccountInputDTO {
  @IsNumber()
  @IsNotEmpty()
  fromAccountId: number;

  @IsNumber()
  @IsNotEmpty()
  toAccountId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

class TransactionDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty()
  fromAccountId: number;

  @ApiProperty()
  toAccountId?: number;

  @ApiProperty()
  typeTransactions: TypeTransactionsEnum;

  @ApiProperty()
  typeOperations: TypeOperationsEnum;

  @ApiProperty()
  value: number;

  @ApiProperty()
  oldBalance: number;

  @ApiProperty()
  newBalance: number;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  createdAt: Date;
}

class AccountDTO {
  @ApiProperty({ example: 999 })
  id: number;

  @ApiProperty({ example: 'Maisson Saraiva Moreira' })
  name: string;

  @ApiProperty({ example: 100 })
  balance: number;
}
export class ShowStatementAccountOutputDTO {
  @ApiProperty({ type: () => AccountDTO })
  account: AccountDTO;

  @ApiProperty({ type: () => TransactionDTO, isArray: true })
  statements: TransactionDTO[];
}
