import { Module } from '@nestjs/common';
import { AccountRepository } from './prisma/repositories/account.repositories';

import { PrismaService } from './prisma/prisma.service';
import { TransactionRepository } from './prisma/repositories/transaction.repositories';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      inject: [PrismaService],
      provide: AccountRepository.name,
      useFactory: (prismaService: PrismaService) => new AccountRepository(prismaService),
    },
    {
      inject: [PrismaService],
      provide: TransactionRepository.name,
      useFactory: (prismaService: PrismaService) => new TransactionRepository(prismaService),
    },
  ],
  exports: [AccountRepository.name, TransactionRepository.name],
})
export class DatabaseModule {}
