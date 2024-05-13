import { TransactionModel } from '@/domain/models/transaction.model';

export namespace IShowStatementAccountUseCase {
  export type Output = {
    account: {
      id: number;
      name: string;
      balance: number;
    };
    statements: TransactionModel[];
  };
}

export interface IShowStatementAccountUseCase {
  execute(accountId: number): Promise<IShowStatementAccountUseCase.Output>;
}
