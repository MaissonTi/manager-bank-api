export interface ITransferAccountUseCase {
  execute(fromAccountId: number, value: number, toAccountId: number): Promise<void>;
}
