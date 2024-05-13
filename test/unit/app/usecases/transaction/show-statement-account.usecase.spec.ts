import { ShowStatementAccountUsecase } from '@/app/usecases/transaction/show-statement-account.usecase';
import { TransactionModel } from '@/domain/models/transaction.model';
import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { NotFoundException } from '@nestjs/common';
import { mockAcctount } from '@test/_mock/acctount.mock';
import { mockTransaction } from '@test/_mock/transaction.mock';

interface SutTypes {
  sut: ShowStatementAccountUsecase;
  accountRepository: IAccountRepository;
  transactionRepository: ITransactionRepository;
}

const makeSut = (): SutTypes => {
  const accountRepository: IAccountRepository = {
    create: jest.fn(),
    findByDocument: jest.fn(),
    findById: jest.fn().mockReturnValue(mockAcctount),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const transactionRepository: ITransactionRepository = {
    findByAccountId: jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }] as TransactionModel[]),
    create: jest.fn().mockReturnValue(mockTransaction),
  };

  const sut = new ShowStatementAccountUsecase(accountRepository, transactionRepository);
  return { sut, accountRepository, transactionRepository };
};
describe('ShowStatementAccountUsecase', () => {
  it('should display an account statement', async () => {
    const { sut, accountRepository, transactionRepository } = makeSut();

    const result = await sut.execute(mockAcctount.id);

    expect(result).toEqual(
      expect.objectContaining({
        account: expect.anything(),
        statements: expect.anything(),
      }),
    );

    expect(result.account.id).toBe(mockAcctount.id);
    expect(result.statements.length).toBe(2);
    expect(accountRepository.findById).toHaveBeenCalledWith(mockAcctount.id);
    expect(transactionRepository.findByAccountId).toHaveBeenCalledWith(mockAcctount.id);
  });

  it('should display Account not found (NotFoundException)', async () => {
    const { sut, accountRepository, transactionRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(undefined));

    const promise = sut.execute(mockAcctount.id);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(accountRepository.findById).toHaveBeenCalled();
    expect(transactionRepository.findByAccountId).not.toHaveBeenCalled();
  });
});
