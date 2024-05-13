import { TypeOperationsEnum } from '@/domain/enum/type-operations.enum';
import { TypeTransactionsEnum } from '@/domain/enum/type-transactions.enum';
import { AccountModel } from '@/domain/models/account.model';
import { TransactionModel } from '@/domain/models/transaction.model';
import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { ITransferAccountUseCase } from '@/domain/usecases/transaction/transfer-account.usecase.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class TransferAccountUseCase implements ITransferAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}
  async execute(fromAccountId: number, value: number, toAccountId: number): Promise<void> {
    const existsFromAccount = await this.accountRepository.findById(fromAccountId);
    const existsToAccount = await this.accountRepository.findById(toAccountId);

    if (!existsFromAccount) {
      throw new NotFoundException('Account not found');
    }

    if (!existsToAccount) {
      throw new NotFoundException('Destinet Account not found');
    }

    if (value > existsFromAccount.balance) {
      throw new BadRequestException('Insufficient balance');
    }

    try {
      await Promise.all([
        this.createTransactionFromAccount(existsFromAccount, value, existsToAccount),
        this.createTransactionToAccount(existsFromAccount, value, existsToAccount),
      ]);
    } catch (error) {
      throw new BadRequestException(
        `Error when transferring between accounts. From Account ID ${fromAccountId} to Account ID ${toAccountId}`,
      );
    }
  }

  private async createTransactionFromAccount(
    fromAccount: AccountModel,
    value: number,
    toAccount: AccountModel,
  ): Promise<void> {
    const transaction = {
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      typeTransactions: TypeTransactionsEnum.TRANSFER,
      typeOperations: TypeOperationsEnum.REMOVE,
      oldBalance: fromAccount.balance,
      newBalance: fromAccount.balance - value,
      value: value,
      description: `The amount R$${value} was transferred to ${toAccount.name}`,
    } as TransactionModel;

    fromAccount.balance -= value;

    await Promise.all([
      this.transactionRepository.create(transaction),
      this.accountRepository.update(fromAccount.id, fromAccount),
    ]);
  }

  private async createTransactionToAccount(
    fromAccount: AccountModel,
    value: number,
    toAccount: AccountModel,
  ): Promise<void> {
    const transaction = {
      fromAccountId: toAccount.id,
      toAccountId: fromAccount.id,
      typeTransactions: TypeTransactionsEnum.TRANSFER,
      typeOperations: TypeOperationsEnum.ADD,
      oldBalance: toAccount.balance,
      newBalance: toAccount.balance + value,
      value: value,
      description: `You received R$${value} from ${fromAccount.name}`,
    } as TransactionModel;

    toAccount.balance += value;

    await Promise.all([
      this.transactionRepository.create(transaction),
      this.accountRepository.update(toAccount.id, toAccount),
    ]);
  }
}
