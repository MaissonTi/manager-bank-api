import { TransactionModel } from '@/domain/models/transaction.model';

export namespace ITransactionRepository {
  export type paramsCreate = Omit<TransactionModel, 'id'>;
  export type paramsUpdate = Omit<TransactionModel, 'id'>;
}

export interface ITransactionRepository {
  findByAccountId(id: number): Promise<TransactionModel[]>;
  create(Transaction: ITransactionRepository.paramsCreate): Promise<TransactionModel>;
}
