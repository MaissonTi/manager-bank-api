import { IAccountRepository } from '@/domain/protocols/database/repositories/account-repository.interface';
import { AccountModel } from '@/domain/models/account.model';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

export class AccountRepository implements IAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findById(id: number): Promise<AccountModel> {
    const account = await this.prismaService.account.findFirst({
      where: { id },
    });
    return account;
  }

  async findByDocument(document: string): Promise<AccountModel> {
    const account = await this.prismaService.account.findUnique({
      where: { document },
    });
    return account;
  }
  async findAll(data: Prisma.AccountWhereInput): Promise<AccountModel[]> {
    const account = await this.prismaService.account.findMany({
      where: data,
    });
    return account;
  }
  async update(id: number, account: AccountModel): Promise<AccountModel> {
    const accounts = await this.prismaService.account.update({
      where: { id: id },
      data: account,
    });

    return accounts;
  }
  async delete(id: number): Promise<void> {
    await this.prismaService.account.delete({
      where: {
        id,
      },
    });
  }

  async create(data: IAccountRepository.paramsCreate): Promise<AccountModel> {
    return this.prismaService.account.create({ data });
  }
}
