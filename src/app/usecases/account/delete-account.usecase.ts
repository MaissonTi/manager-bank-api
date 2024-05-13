import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { IDeleteAccountUseCase } from '@/domain/usecases/account/delete-account-usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteAccountUseCase implements IDeleteAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}
  async execute(id: number): Promise<void> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw new NotFoundException('Account not found!');
    }

    await this.accountRepository.delete(id);
  }
}
