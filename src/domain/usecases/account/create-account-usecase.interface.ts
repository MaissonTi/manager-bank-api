import { AccountModel } from '@/domain/models/account.model';

export namespace ICreateAccountUseCase {
  export type Input = Omit<AccountModel, 'id' | 'transactions' | 'balance'>;
  export type Output = AccountModel;
}

export interface ICreateAccountUseCase {
  execute(account: ICreateAccountUseCase.Input): Promise<AccountModel>;
}
