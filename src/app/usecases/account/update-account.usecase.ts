import { AccountModel } from '@/domain/models/account.model';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { IUpdateAccountUseCase } from '@/domain/usecases/account/update-account-usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class UpdateAccountUseCase implements IUpdateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}
  async execute(id: number, account: IUpdateAccountUseCase.Input): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw new NotFoundException('Account not found!');
    }

    return this.accountRepository.update(id, { name: account.name });
  }
}
