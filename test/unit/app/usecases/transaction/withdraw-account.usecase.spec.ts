import { WithdrawAccountUseCase } from '@/app/usecases/transaction/withdraw-account.usecase';
import { TypeOperationsEnum } from '@/domain/enum/type-operations.enum';
import { TypeTransactionsEnum } from '@/domain/enum/type-transactions.enum';
import { TransactionModel } from '@/domain/models/transaction.model';
import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockAcctount } from '@test/_mock/acctount.mock';
import { mockTransaction } from '@test/_mock/transaction.mock';

interface SutTypes {
  sut: WithdrawAccountUseCase;
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
    findByAccountId: jest.fn().mockReturnValue(null),
    create: jest.fn().mockReturnValue(mockTransaction),
  };

  const sut = new WithdrawAccountUseCase(accountRepository, transactionRepository);
  return { sut, accountRepository, transactionRepository };
};
describe('WithdrawAccountUseCase', () => {
  it('should withdraw some amount from the account and create a transaction', async () => {
    const { sut, accountRepository, transactionRepository } = makeSut();

    const inputValue = 100;

    await sut.execute(mockAcctount.id, inputValue);

    expect(accountRepository.findById).toHaveBeenCalledWith(mockAcctount.id);
    expect(transactionRepository.create).toHaveBeenCalledWith({
      fromAccountId: mockAcctount.id,
      description: `The amount of R$${mockTransaction.value} was withdrawn`,
      typeTransactions: TypeTransactionsEnum.WITHDRAW,
      typeOperations: TypeOperationsEnum.REMOVE,
      newBalance: mockAcctount.balance,
      oldBalance: mockAcctount.balance + inputValue,
      value: inputValue,
    } as TransactionModel);
    expect(accountRepository.update).toHaveBeenCalledWith(mockAcctount.id, mockAcctount);
  });

  it('should display insufficient balance (BadRequestException)', async () => {
    const { sut, accountRepository, transactionRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve({ ...mockAcctount, balance: 100 }));

    const inputValue = 200;

    const promise = sut.execute(mockAcctount.id, inputValue);

    await expect(promise).rejects.toThrow(BadRequestException);
    expect(accountRepository.findById).toHaveBeenCalled();
    expect(accountRepository.update).not.toHaveBeenCalled();
    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should display Account not found (NotFoundException)', async () => {
    const { sut, accountRepository, transactionRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(undefined));

    const inputValue = 100;

    const promise = sut.execute(mockAcctount.id, inputValue);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(accountRepository.findById).toHaveBeenCalled();
    expect(accountRepository.update).not.toHaveBeenCalled();
    expect(transactionRepository.create).not.toHaveBeenCalled();
  });
});
