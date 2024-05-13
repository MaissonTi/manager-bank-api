import { DeleteAccountUseCase } from '@/app/usecases/account/delete-account.usecase';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { NotFoundException } from '@nestjs/common';
import { mockAcctount } from '@test/_mock/acctount.mock';

interface SutTypes {
  sut: DeleteAccountUseCase;
  accountRepository: IAccountRepository;
}
const makeSut = (): SutTypes => {
  const accountRepository: IAccountRepository = {
    create: jest.fn(),
    findByDocument: jest.fn(),
    findById: jest.fn().mockReturnValue(mockAcctount),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const sut = new DeleteAccountUseCase(accountRepository);
  return { sut, accountRepository };
};
describe('DeleteAccountUseCase', () => {
  it('should remover a Account', async () => {
    const { sut, accountRepository } = makeSut();

    await sut.execute(mockAcctount.id);

    expect(accountRepository.findById).toHaveBeenCalledWith(mockAcctount.id);
    expect(accountRepository.delete).toHaveBeenCalledWith(mockAcctount.id);
  });

  it('should throw an exception of type NotFoundException', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(undefined));

    const promise = sut.execute(mockAcctount.id);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(accountRepository.delete).not.toHaveBeenCalled();
  });
});
