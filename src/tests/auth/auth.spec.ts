import { validAccount, invalidAccount } from '../generator/auth-generator';
import Request from 'supertest';
import { expect } from 'chai';

describe(`Auth test suite.`, () => {
  it(`Successful authentication [POST /auth]`, async function () {
    const user = await validAccount();
    const req = await Request(this.server)
      .post(`/auth`)
      .auth(user.email, user.password);
    expect(req.status).to.equal(200);
  });

  it(`Unsuccessful authentication [POST /auth]`, async function () {
    const user = invalidAccount();
    const req = await Request(this.server)
      .post(`/auth`)
      .auth(user.username, user.password);
    expect(req.status).to.equal(400);
  });
});
