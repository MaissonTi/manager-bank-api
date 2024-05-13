import { TypeOperationsEnum } from '@/domain/enum/type-operations.enum';
import { TypeTransactionsEnum } from '@/domain/enum/type-transactions.enum';
import { TransactionModel } from '@/domain/models/transaction.model';
import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { IDepositAccountUseCase } from '@/domain/usecases/transaction/deposit-account.usecase.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class DepositAccountUseCase implements IDepositAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}
  async execute(accountId: number, value: number): Promise<void> {
    const existsAccount = await this.accountRepository.findById(accountId);

    if (!existsAccount) {
      throw new NotFoundException('Account not found');
    }

    const transaction = {
      fromAccountId: accountId,
      typeTransactions: TypeTransactionsEnum.DEPOSIT,
      typeOperations: TypeOperationsEnum.ADD,
      oldBalance: existsAccount.balance,
      newBalance: existsAccount.balance + value,
      value: value,
      description: `The amount of R$${value} was deposited`,
    } as TransactionModel;

    existsAccount.balance += value;

    try {
      await Promise.all([
        this.transactionRepository.create(transaction),
        this.accountRepository.update(accountId, existsAccount),
      ]);
    } catch (error) {
      throw new BadRequestException(`Error receiving a deposit. Account Id ${accountId}`);
    }
  }
}
