import { mockAcctountE2E, mockOtherAcctountE2E } from '@test/_mock/acctount.mock';
import { app } from '../setup';
import request from 'supertest';
import { TransferAccountInputDTO } from '@/presentation/http/dtos/transaction.dto';

describe('[e2e] TransactionController', () => {
  let accountId: number;
  let accountOtherId: number;

  beforeAll(async () => {
    const accountResponse = await request(app.getHttpServer()).post('/account').send(mockAcctountE2E);
    accountId = accountResponse.body.id;

    const accounOtherResponse = await request(app.getHttpServer()).post('/account').send(mockOtherAcctountE2E);
    accountOtherId = accounOtherResponse.body.id;
  });

  describe('(POST) PATH: "/transaction/deposit" ', () => {
    it('Deposit', async () => {
      const transactionResponse = await request(app.getHttpServer()).post('/transaction/deposit').send({
        accountId,
        value: 500,
      });

      expect(transactionResponse.status).toBe(204);
      expect(transactionResponse.body).toEqual({});
    });
  });

  describe('(POST) PATH: "/transaction/withdraw" ', () => {
    it('Withdraw', async () => {
      const transactionResponse = await request(app.getHttpServer()).post(`/transaction/withdraw`).send({
        accountId,
        value: 100,
      });

      expect(transactionResponse.status).toBe(204);
      expect(transactionResponse.body).toEqual({});
    });
  });

  describe('(POST) PATH: "transaction/transfer" ', () => {
    it('Transfer', async () => {
      const transactionResponse = await request(app.getHttpServer())
        .post(`/transaction/transfer`)
        .send({
          fromAccountId: accountId,
          value: 100,
          toAccountId: accountOtherId,
        } as TransferAccountInputDTO);

      expect(transactionResponse.status).toBe(204);
      expect(transactionResponse.body).toEqual({});
    });
  });

  describe('(GET) PATH: "transaction/statement/:id" ', () => {
    it('Statement Account 1', async () => {
      const transactionResponse = await request(app.getHttpServer()).get(`/transaction/statement/${accountId}`).send();

      expect(transactionResponse.status).toBe(200);
      expect(transactionResponse.body).toEqual(
        expect.objectContaining({
          account: expect.anything(),
          statements: expect.anything(),
        }),
      );
      expect(transactionResponse.body.account.id).toBe(accountId);
      expect(transactionResponse.body.account.balance).toBe(300);
      expect(transactionResponse.body.statements.length).toBe(3);
    });

    it('Statement Account 2', async () => {
      const transactionResponse = await request(app.getHttpServer())
        .get(`/transaction/statement/${accountOtherId}`)
        .send();

      expect(transactionResponse.status).toBe(200);
      expect(transactionResponse.body).toEqual(
        expect.objectContaining({
          account: expect.anything(),
          statements: expect.anything(),
        }),
      );
      expect(transactionResponse.body.account.id).toBe(accountOtherId);
      expect(transactionResponse.body.account.balance).toBe(100);
      expect(transactionResponse.body.statements.length).toBe(1);
    });
  });
});
