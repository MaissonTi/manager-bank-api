import { Module } from '@nestjs/common';
import { AccountRepository } from '@/infra/database/prisma/repositories/account.repositories';
import { CreateAccountUseCase } from '@/app/usecases/account/create-account.usecase';
import { InfraModule } from '@/infra/_infra.module';
import { DeleteAccountUseCase } from './delete-account.usecase';
import { UpdateAccountUseCase } from './update-account.usecase';
import { GetAccountUseCase } from './get-account.usecase';

@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [AccountRepository.name],
      provide: CreateAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository) => new CreateAccountUseCase(accountRepository),
    },
    {
      inject: [AccountRepository.name],
      provide: DeleteAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository) => new DeleteAccountUseCase(accountRepository),
    },
    {
      inject: [AccountRepository.name],
      provide: UpdateAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository) => new UpdateAccountUseCase(accountRepository),
    },
    {
      inject: [AccountRepository.name],
      provide: GetAccountUseCase.name,
      useFactory: (accountRepository: AccountRepository) => new GetAccountUseCase(accountRepository),
    },
  ],
  exports: [CreateAccountUseCase.name, DeleteAccountUseCase.name, UpdateAccountUseCase.name, GetAccountUseCase.name],
})
export class AccountModule {}
