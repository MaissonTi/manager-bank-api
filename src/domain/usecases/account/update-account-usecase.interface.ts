import { AccountModel } from '@/domain/models/account.model';

export namespace IUpdateAccountUseCase {
  export type Input = Omit<AccountModel, 'id' | 'transactions' | 'balance' | 'document'>;
  export type Output = AccountModel;
}

export interface IUpdateAccountUseCase {
  execute(id: number, data: IUpdateAccountUseCase.Input): Promise<IUpdateAccountUseCase.Output>;
}
