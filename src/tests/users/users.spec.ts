import app from '../../index';
import { completeDummyUser } from '../generator/user-generator';
import Request from 'supertest';
import { expect } from 'chai';

describe(`Users test suite.`, () => {
  it(`Successful add user [POST /users]`, async () => {
    const data = completeDummyUser();
    const req = await Request(app).post(`/users`).send(data);
    expect(req.status).to.equal(201);
  });

  it(`Add user, missing name value [POST /users]`, async () => {
    const data = completeDummyUser();
    delete data.name;
    const req = await Request(app).post(`/users`).send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add user, missing email value [POST /users]`, async () => {
    const data = completeDummyUser();
    delete data.email;
    const req = await Request(app).post(`/users`).send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add user, missing password value [POST /users]`, async () => {
    const data = completeDummyUser();
    delete data.password;
    const req = await Request(app).post(`/users`).send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add user, user already exist [POST /users]`, async () => {
    const user = completeDummyUser();
    await Request(app).post(`/users`).send(user);

    const req = await Request(app).post(`/users`).send(user);

    expect(req.status).to.equal(400);
  });

  it(`Successful fetch all product on a user [GET /users]`, async () => {
    const req = await Request(app).get(`/users`);
    expect(req.status).to.equal(200);
  });
});
