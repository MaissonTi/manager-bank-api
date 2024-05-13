import { Module } from '@nestjs/common';
import { HealthController } from './http/controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AccountController } from './http/controllers/account.controller';
import { UseCasesModule } from '@/app/usecases/_usecases.module';
import { TransactionController } from './http/controllers/transaction.controller';

@Module({
  imports: [TerminusModule, UseCasesModule],
  controllers: [HealthController, AccountController, TransactionController],
  providers: [],
})
export class PresentationModule {}
