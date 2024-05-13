import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDepositAccountUseCase } from '@/domain/usecases/transaction/deposit-account.usecase.interface';
import { ShowStatementAccountOutputDTO, TransactionInputDTO, TransferAccountInputDTO } from '../dtos/transaction.dto';
import { DepositAccountUseCase } from '@/app/usecases/transaction/deposit-account.usecase';
import { WithdrawAccountUseCase } from '@/app/usecases/transaction/withdraw-account.usecase';
import { IWithdrawAccountUseCase } from '@/domain/usecases/transaction/withdraw-account.usecase.interface';
import { TransferAccountUseCase } from '@/app/usecases/transaction/transfer-account.usecase';
import { ITransferAccountUseCase } from '@/domain/usecases/transaction/transfer-account.usecase.interface';
import { ShowStatementAccountUsecase } from '@/app/usecases/transaction/show-statement-account.usecase';
import { IShowStatementAccountUseCase } from '@/domain/usecases/transaction/show-statement-account.usecase.interface';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(DepositAccountUseCase.name)
    private readonly depositAccountUsecase: IDepositAccountUseCase,

    @Inject(WithdrawAccountUseCase.name)
    private readonly withdrawAccountUseCase: IWithdrawAccountUseCase,

    @Inject(TransferAccountUseCase.name)
    private readonly transferAccountUseCase: ITransferAccountUseCase,

    @Inject(ShowStatementAccountUsecase.name)
    private readonly showStatementAccountUsecase: IShowStatementAccountUseCase,
  ) {}

  @Post('deposit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Deposit successfully',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiBadRequestResponse({
    description: 'Error receiving a deposit',
  })
  async deposit(@Body() { accountId, value }: TransactionInputDTO): Promise<void> {
    await this.depositAccountUsecase.execute(accountId, value);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Withdraw successfully',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiBadRequestResponse({
    description: 'Insufficient balance | Error when withdrawing',
  })
  async withdraw(@Body() { accountId, value }: TransactionInputDTO): Promise<void> {
    await this.withdrawAccountUseCase.execute(accountId, value);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Transfer successfully',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiBadRequestResponse({
    description: 'Insufficient balance | Error when withdrawing',
  })
  async transfer(@Body() { fromAccountId, value, toAccountId }: TransferAccountInputDTO): Promise<void> {
    await this.transferAccountUseCase.execute(fromAccountId, value, toAccountId);
  }

  @Get('statement/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Statement account successfully',
    type: ShowStatementAccountOutputDTO,
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  async statement(@Param('id', ParseIntPipe) id: number): Promise<ShowStatementAccountOutputDTO> {
    return this.showStatementAccountUsecase.execute(id);
  }
}
