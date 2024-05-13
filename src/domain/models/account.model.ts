import { TransactionModel } from './transaction.model';

export type AccountModel = {
  id: number;
  name: string;
  document: string;
  balance: number;
  transactions?: TransactionModel[];
  createdAt?: Date;
};
