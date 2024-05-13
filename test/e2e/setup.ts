import { AppModule } from '../../src/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing/test';

let app: INestApplication;
let testingModule: TestingModule;
let prismaService: PrismaService;

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  prismaService = new PrismaService();

  app = testingModule.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
});

afterAll(async () => {
  await prismaService.transaction.deleteMany();
  await prismaService.account.deleteMany();
  await prismaService.$disconnect();
  await app.close();
});

beforeAll(async () => {
  await prismaService.transaction.deleteMany();
  await prismaService.account.deleteMany();
});

export { app, testingModule, prismaService };
