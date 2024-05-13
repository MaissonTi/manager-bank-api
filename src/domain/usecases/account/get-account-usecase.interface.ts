import { AccountModel } from 'src/domain/models/account.model';

export namespace IGetAccountUseCase {
  export type Output = AccountModel;
}

export interface IGetAccountUseCase {
  execute(id: number): Promise<IGetAccountUseCase.Output>;
}
