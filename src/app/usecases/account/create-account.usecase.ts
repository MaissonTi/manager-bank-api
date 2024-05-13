import { AccountModel } from '@/domain/models/account.model';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { ICreateAccountUseCase } from '@/domain/usecases/account/create-account-usecase.interface';
import { BadRequestException } from '@nestjs/common';

export class CreateAccountUseCase implements ICreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}
  async execute(account: ICreateAccountUseCase.Input): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findByDocument(account.document);

    if (existsAccount) {
      throw new BadRequestException(`Account already exists with this document ${account.document}`);
    }

    return this.accountRepository.create(account);
  }
}
