import { TypeOperationsEnum } from '../enum/type-operations.enum';
import { TypeTransactionsEnum } from '../enum/type-transactions.enum';

export type TransactionModel = {
  id: number;
  fromAccountId: number;
  toAccountId?: number;
  typeTransactions: TypeTransactionsEnum;
  typeOperations: TypeOperationsEnum;
  value: number;
  oldBalance: number;
  newBalance: number;
  description?: string;
  createdAt: Date;
};
