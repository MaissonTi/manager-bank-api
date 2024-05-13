import { TransactionModel } from '@/domain/models/transaction.model';

export const mockTransaction = {
  fromAccountId: 1,
  value: 100,
  oldBalance: 0,
  newBalance: 100,
} as TransactionModel;
