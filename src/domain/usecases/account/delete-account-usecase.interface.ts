export interface IDeleteAccountUseCase {
  execute(id: number): Promise<void>;
}
