import { AccountRepository } from '@/infra/database/prisma/repositories/account.repositories';
import { TransactionRepository } from '@/infra/database/prisma/repositories/transaction.repositories';
import { Module } from '@nestjs/common';
import { DepositAccountUseCase } from './deposit-account.usecase';
import { InfraModule } from '@/infra/_infra.module';
import { WithdrawAccountUseCase } from './withdraw-account.usecase';
import { TransferAccountUseCase } from './transfer-account.usecase';
import { ShowStatementAccountUsecase } from './show-statement-account.usecase';
@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [AccountRepository.name, TransactionRepository.name],
      provide: DepositAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository, transactionRepository: TransactionRepository) =>
        new DepositAccountUseCase(accountRepository, transactionRepository),
    },
    {
      inject: [AccountRepository.name, TransactionRepository.name],
      provide: WithdrawAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository, transactionRepository: TransactionRepository) =>
        new WithdrawAccountUseCase(accountRepository, transactionRepository),
    },
    {
      inject: [AccountRepository.name, TransactionRepository.name],
      provide: TransferAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository, transactionRepository: TransactionRepository) =>
        new TransferAccountUseCase(accountRepository, transactionRepository),
    },
    {
      inject: [AccountRepository.name, TransactionRepository.name],
      provide: ShowStatementAccountUsecase.name,
      useFactory: (accountRepository: AccountRepository, transactionRepository: TransactionRepository) =>
        new ShowStatementAccountUsecase(accountRepository, transactionRepository),
    },
  ],
  exports: [
    DepositAccountUseCase.name,
    WithdrawAccountUseCase.name,
    TransferAccountUseCase.name,
    ShowStatementAccountUsecase.name,
  ],
})
export class TransactionModule {}
