import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';

import { IShowStatementAccountUseCase } from '@/domain/usecases/transaction/show-statement-account.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class ShowStatementAccountUsecase implements IShowStatementAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}
  async execute(accountId: number): Promise<IShowStatementAccountUseCase.Output> {
    const existsAccount = await this.accountRepository.findById(accountId);

    if (!existsAccount) {
      throw new NotFoundException('Account not found!');
    }

    const statements = await this.transactionRepository.findByAccountId(accountId);

    return {
      account: {
        id: existsAccount.id,
        name: existsAccount.name,
        balance: existsAccount.balance,
      },
      statements,
    };
  }
}
