import { Module } from '@nestjs/common';
import { AccountModule } from './account/_account.module';
import { TransactionModule } from './transaction/_transaction.module';
@Module({
  imports: [AccountModule, TransactionModule],
  providers: [],
  exports: [AccountModule, TransactionModule],
})
export class UseCasesModule {}
