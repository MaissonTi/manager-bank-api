import { ITransactionRepository } from '@/domain/protocols/database/repositories/transaction-repository.interface';
import { TransactionModel } from '@/domain/models/transaction.model';
import { PrismaService } from '../prisma.service';
import { TransactionMapper } from '../mapper/transaction.mapper';

export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findById(id: number): Promise<TransactionModel> {
    const result = await this.prismaService.transaction.findFirst({
      where: { id },
    });
    return TransactionMapper.toModel(result);
  }

  async findByAccountId(id: number): Promise<TransactionModel[]> {
    const result = await this.prismaService.transaction.findMany({
      where: { fromAccountId: id },
    });

    return result.map(transaction => TransactionMapper.toModel(transaction));
  }
  async update(id: number, data: TransactionModel): Promise<TransactionModel> {
    const transaction = await this.prismaService.transaction.update({
      where: { id: id },
      data: data,
    });

    return TransactionMapper.toModel(transaction);
  }
  async delete(id: number): Promise<void> {
    await this.prismaService.transaction.delete({
      where: {
        id,
      },
    });
  }

  async create(data: ITransactionRepository.paramsCreate): Promise<TransactionModel> {
    return this.prismaService.transaction.create({ data });
  }
}
