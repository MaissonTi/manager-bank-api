import { mockMoreOtherAcctountE2E } from '@test/_mock/acctount.mock';
import { app } from '../setup';
import request from 'supertest';

describe('[e2e] AccountController', () => {
  let accountId: number;

  describe('(POST) PATH: "/account" ', () => {
    it('Create a new Account', async () => {
      const accountResponse = await request(app.getHttpServer()).post('/account').send(mockMoreOtherAcctountE2E);

      expect(accountResponse.status).toBe(201);
      expect(accountResponse.body).toEqual(expect.objectContaining(mockMoreOtherAcctountE2E));

      accountId = accountResponse.body.id;
    });

    it('Bad Request: Account already exists', async () => {
      const accountResponse = await request(app.getHttpServer()).post('/account').send(mockMoreOtherAcctountE2E);

      expect(accountResponse.status).toBe(400);
      expect(accountResponse.body).toEqual(
        expect.objectContaining({
          message: `Account already exists with this document ${mockMoreOtherAcctountE2E.document}`,
        }),
      );
    });
  });

  describe('(PUT) PATH: "/account/:id" ', () => {
    it('Update a Account', async () => {
      const accountResponse = await request(app.getHttpServer())
        .put(`/account/${accountId}`)
        .send({ name: 'New Name' });

      expect(accountResponse.status).toBe(200);
      expect(accountResponse.body).toEqual(
        expect.objectContaining({
          name: 'New Name',
        }),
      );
    });
  });

  describe('(GET) PATH: "/account/:id" ', () => {
    it('Get a Account', async () => {
      const accountResponse = await request(app.getHttpServer()).get(`/account/${accountId}`).send();

      expect(accountResponse.status).toBe(200);
      expect(accountResponse.body).toEqual(
        expect.objectContaining({
          id: accountId,
        }),
      );
    });
  });

  describe('(DELETE) PATH: "/account/:id" ', () => {
    it('Delete a Account', async () => {
      const accountResponse = await request(app.getHttpServer()).delete(`/account/${accountId}`).send();

      expect(accountResponse.status).toBe(204);
      expect(accountResponse.body).toEqual({});
    });
  });
});
