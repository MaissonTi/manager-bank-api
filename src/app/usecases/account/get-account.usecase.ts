import { AccountModel } from '@/domain/models/account.model';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { IGetAccountUseCase } from '@/domain/usecases/account/get-account-usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class GetAccountUseCase implements IGetAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}
  async execute(id: number): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw new NotFoundException('Account not found!');
    }

    return existsAccount;
  }
}
