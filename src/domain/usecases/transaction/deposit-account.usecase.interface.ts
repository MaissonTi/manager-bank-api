export interface IDepositAccountUseCase {
  execute(accountId: number, value: number): Promise<void>;
}
