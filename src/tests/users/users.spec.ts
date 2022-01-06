import { completeDummyUser } from '../generator/user-generator';
import Request from 'supertest';
import { expect } from 'chai';

describe(`Users test suite.`, function () {
  it(`Successful add user [POST /users]`, async function () {
    const data = completeDummyUser();
    const req = await Request(this.server).post(`/users`).send(data);
    expect(req.status).to.equal(201);
  });

  it(`Add user, missing name value [POST /users]`, async function () {
    const data = completeDummyUser();
    delete data.name;
    const req = await Request(this.server).post(`/users`).send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add user, missing email value [POST /users]`, async function () {
    const data = completeDummyUser();
    delete data.email;
    const req = await Request(this.server).post(`/users`).send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add user, missing password value [POST /users]`, async function () {
    const data = completeDummyUser();
    delete data.password;
    const req = await Request(this.server).post(`/users`).send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add user, user already exist [POST /users]`, async function () {
    const user = completeDummyUser();
    await Request(this.server).post(`/users`).send(user);

    const req = await Request(this.server).post(`/users`).send(user);

    expect(req.status).to.equal(400);
  });

  it(`Successful fetch all product on a user [GET /users]`, async function () {
    const req = await Request(this.server).get(`/users`);
    expect(req.status).to.equal(200);
  });
});
