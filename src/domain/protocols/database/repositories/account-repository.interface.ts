import { AccountModel } from '@/domain/models/account.model';

export namespace IAccountRepository {
  export type paramsCreate = Omit<AccountModel, 'id' | 'transactions' | 'balance'>;
  export type paramsUpdate = Omit<AccountModel, 'id' | 'transactions' | 'balance' | 'document'>;
}

export interface IAccountRepository {
  findById(id: number): Promise<AccountModel>;
  findByDocument(document: string): Promise<AccountModel>;
  create(account: IAccountRepository.paramsCreate): Promise<AccountModel>;
  update(id: number, account: IAccountRepository.paramsUpdate): Promise<AccountModel>;
  delete(id: number): Promise<void>;
}
