import { CreateAccountUseCase } from '@/app/usecases/account/create-account.usecase';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { BadRequestException } from '@nestjs/common';
import { mockAcctount } from '@test/_mock/acctount.mock';

interface SutTypes {
  sut: CreateAccountUseCase;
  accountRepository: IAccountRepository;
}

const makeSut = (): SutTypes => {
  const accountRepository: IAccountRepository = {
    create: jest.fn().mockReturnValue(mockAcctount),
    findByDocument: jest.fn().mockReturnValue(null),
    findById: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const sut = new CreateAccountUseCase(accountRepository);
  return { sut, accountRepository };
};
describe('CreateAccountUseCases', () => {
  it('should create new Account', async () => {
    const { sut, accountRepository } = makeSut();

    const result = await sut.execute(mockAcctount);

    expect(result.id).toEqual(mockAcctount.id);
    expect(accountRepository.create).toHaveBeenCalledWith(mockAcctount);
    expect(accountRepository.findByDocument).toHaveBeenCalled();
  });

  it('should throw an exception of type BadRequestException', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'findByDocument').mockReturnValueOnce(Promise.resolve(mockAcctount));

    const promise = sut.execute(mockAcctount);

    await expect(promise).rejects.toThrow(BadRequestException);
    expect(accountRepository.create).not.toHaveBeenCalled();
  });
});
