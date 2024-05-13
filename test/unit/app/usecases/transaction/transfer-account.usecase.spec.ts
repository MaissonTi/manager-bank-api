import { TransferAccountUseCase } from '@/app/usecases/transaction/transfer-account.usecase';
import { TypeOperationsEnum } from '@/domain/enum/type-operations.enum';
import { TypeTransactionsEnum } from '@/domain/enum/type-transactions.enum';
import { TransactionModel } from '@/domain/models/transaction.model';
import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockAcctount, mockOtherAcctount } from '@test/_mock/acctount.mock';
import { mockTransaction } from '@test/_mock/transaction.mock';

interface SutTypes {
  sut: TransferAccountUseCase;
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

  const sut = new TransferAccountUseCase(accountRepository, transactionRepository);

  return { sut, accountRepository, transactionRepository };
};
describe('TransferAccountUseCase', () => {
  it('should transfer amounts between accounts', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(sut as any, 'createTransactionFromAccount').mockReturnValueOnce(Promise.resolve());
    jest.spyOn(sut as any, 'createTransactionToAccount').mockReturnValueOnce(Promise.resolve());
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(mockAcctount));
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(mockOtherAcctount));

    const inputValue = 100;

    await sut.execute(mockAcctount.id, inputValue, mockOtherAcctount.id);

    expect(accountRepository.findById).toHaveBeenCalledWith(mockAcctount.id);
    expect(accountRepository.findById).toHaveBeenCalledWith(mockOtherAcctount.id);
    expect(sut['createTransactionFromAccount']).toHaveBeenCalledWith(mockAcctount, inputValue, mockOtherAcctount);
    expect(sut['createTransactionToAccount']).toHaveBeenCalledWith(mockAcctount, inputValue, mockOtherAcctount);
  });

  describe('createTransactionFromAccount()', () => {
    it('should transfer to another account', async () => {
      const { sut, accountRepository, transactionRepository } = makeSut();

      const inputValue = 100;

      await sut['createTransactionFromAccount'](mockAcctount, inputValue, mockOtherAcctount);

      expect(transactionRepository.create).toHaveBeenCalledWith({
        fromAccountId: mockAcctount.id,
        toAccountId: mockOtherAcctount.id,
        description: `The amount R$${inputValue} was transferred to ${mockOtherAcctount.name}`,
        typeTransactions: TypeTransactionsEnum.TRANSFER,
        typeOperations: TypeOperationsEnum.REMOVE,
        newBalance: mockAcctount.balance,
        oldBalance: mockAcctount.balance + inputValue,
        value: inputValue,
      } as TransactionModel);
      expect(accountRepository.update).toHaveBeenCalledWith(mockAcctount.id, mockAcctount);
    });
  });

  describe('createTransactionToAccount()', () => {
    it('should transfer to another account', async () => {
      const { sut, accountRepository, transactionRepository } = makeSut();

      const inputValue = 100;

      await sut['createTransactionToAccount'](mockAcctount, inputValue, mockOtherAcctount);

      expect(transactionRepository.create).toHaveBeenCalledWith({
        fromAccountId: mockOtherAcctount.id,
        toAccountId: mockAcctount.id,
        description: `You received R$${inputValue} from ${mockAcctount.name}`,
        typeTransactions: TypeTransactionsEnum.TRANSFER,
        typeOperations: TypeOperationsEnum.ADD,
        newBalance: mockOtherAcctount.balance,
        oldBalance: mockOtherAcctount.balance - inputValue,
        value: inputValue,
      } as TransactionModel);
      expect(accountRepository.update).toHaveBeenCalledWith(mockOtherAcctount.id, mockOtherAcctount);
    });
  });

  it('should display insufficient balance (BadRequestException)', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve({ ...mockAcctount, balance: 100 }));
    jest.spyOn(sut as any, 'createTransactionFromAccount').mockReturnValueOnce(Promise.resolve());
    jest.spyOn(sut as any, 'createTransactionToAccount').mockReturnValueOnce(Promise.resolve());

    const inputValue = 200;

    const promise = sut.execute(mockAcctount.id, inputValue, mockOtherAcctount.id);

    await expect(promise).rejects.toThrow(BadRequestException);
    expect(accountRepository.findById).toHaveBeenCalled();
    expect(sut['createTransactionFromAccount']).not.toHaveBeenCalled();
    expect(sut['createTransactionToAccount']).not.toHaveBeenCalled();
  });

  it('should display Account not found (NotFoundException)', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'findById').mockReturnValueOnce(Promise.resolve(undefined));
    jest.spyOn(sut as any, 'createTransactionFromAccount').mockReturnValueOnce(Promise.resolve());
    jest.spyOn(sut as any, 'createTransactionToAccount').mockReturnValueOnce(Promise.resolve());

    const inputValue = 100;

    const promise = sut.execute(mockAcctount.id, inputValue, mockOtherAcctount.id);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(accountRepository.findById).toHaveBeenCalled();
    expect(sut['createTransactionFromAccount']).not.toHaveBeenCalled();
    expect(sut['createTransactionToAccount']).not.toHaveBeenCalled();
  });
});
