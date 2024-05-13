import { UpdateAccountUseCase } from '@/app/usecases/account/update-account.usecase';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { NotFoundException } from '@nestjs/common';
import { mockAcctount } from '@test/_mock/acctount.mock';

interface SutTypes {
  sut: UpdateAccountUseCase;
  accountRepository: IAccountRepository;
}

const mockAcctountUpdate = {
  ...mockAcctount,
  name: 'New Name',
};
const makeSut = (): SutTypes => {
  const accountRepository: IAccountRepository = {
    create: jest.fn(),
    findByDocument: jest.fn(),
    findById: jest.fn().mockReturnValue(mockAcctount),
    delete: jest.fn(),
    update: jest.fn().mockReturnValue(mockAcctountUpdate),
  };

  const sut = new UpdateAccountUseCase(accountRepository);
  return { sut, accountRepository };
};
describe('UpdateAccountUseCase', () => {
  it('should update a Account', async () => {
    const { sut, accountRepository } = makeSut();

    const result = await sut.execute(mockAcctount.id, mockAcctountUpdate);

    expect(result.name).toEqual('New Name');
    expect(accountRepository.findById).toHaveBeenCalledWith(mockAcctount.id);
    expect(accountRepository.update).toHaveBeenCalled();
  });

  it('should throw an exception of type NotFoundException', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(undefined));

    const promise = sut.execute(mockAcctount.id, mockAcctountUpdate);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(accountRepository.findById).toHaveBeenCalledWith(mockAcctount.id);
    expect(accountRepository.update).not.toHaveBeenCalled();
  });
});
