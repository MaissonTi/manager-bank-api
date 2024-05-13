import { TransactionModel } from '@/domain/models/transaction.model';

import { Transaction as PrismaTransaction } from '@prisma/client';

export class TransactionMapper {
  static toModel(data: PrismaTransaction): TransactionModel {
    return {
      id: data.id,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
      typeTransactions: data.typeTransactions,
      typeOperations: data.typeOperations,
      value: data.value,
      oldBalance: data.oldBalance,
      newBalance: data.newBalance,
      description: data.description,
      createdAt: data.createdAt,
    };
  }

  static toPrisma(data: TransactionModel): PrismaTransaction {
    return {
      id: data.id,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
      typeTransactions: data.typeTransactions,
      typeOperations: data.typeOperations,
      value: data.value,
      oldBalance: data.oldBalance,
      newBalance: data.newBalance,
      description: data.description,
      createdAt: data.createdAt,
    };
  }
}
