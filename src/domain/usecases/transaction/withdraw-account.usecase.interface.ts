export interface IWithdrawAccountUseCase {
  execute(accountId: number, value: number): Promise<void>;
}
