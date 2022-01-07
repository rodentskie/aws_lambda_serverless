import Request from 'supertest';
import { expect } from 'chai';
import { completeDummyProduct } from '../generator/product-generator';
import { validAccount } from '../generator/auth-generator';

type auth = {
  token: string;
};

let login: auth;

before(async function () {
  const user = await validAccount();
  const req = await Request(this.server)
    .post(`/auth`)
    .auth(user.email, user.password);

  login = req.body;
});

describe(`Products test suite.`, function () {
  it(`Successful add product [POST /products]`, async function () {
    const req = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(completeDummyProduct());
    expect(req.status).to.equal(201);
  });

  it(`Add product, unauthorized [POST /products]`, async function () {
    const req = await Request(this.server)
      .post(`/products`)
      .send(completeDummyProduct());
    expect(req.status).to.equal(403);
  });

  it(`Add product, missing unique ID [POST /products]`, async function () {
    const data = completeDummyProduct();
    delete data.id;

    const req = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add product, missing product name [POST /products]`, async function () {
    const data = completeDummyProduct();
    delete data.name;

    const req = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add product, missing product price [POST /products]`, async function () {
    const data = completeDummyProduct();
    delete data.price;

    const req = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add product, product ID already exist [POST /products]`, async function () {
    const data = completeDummyProduct();

    await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const req = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Successful update product [PATCH /products]`, async function () {
    const data = completeDummyProduct();

    const inserted = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    delete data.id;
    delete data.createdAt;

    const productId = inserted.body.data._id;

    const req = await Request(this.server)
      .patch(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(202);
  });

  it(`Update product, unauthorized [PATCH /products]`, async function () {
    const data = completeDummyProduct();

    const inserted = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    delete data.id;
    delete data.createdAt;

    const productId = inserted.body.data._id;

    const req = await Request(this.server)
      .patch(`/products/${productId}`)
      .send(data);
    expect(req.status).to.equal(403);
  });

  it(`Update product, different user [PATCH /products]`, async function () {
    const data = completeDummyProduct();

    const inserted = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    delete data.id;
    delete data.createdAt;

    const productId = inserted.body.data._id;

    const user = await validAccount();
    const otherToken = await Request(this.server)
      .post(`/auth`)
      .auth(user.email, user.password);

    const req = await Request(this.server)
      .patch(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + otherToken.body.token)
      .send(data);
    expect(req.status).to.equal(404);
  });

  it(`Successful delete product [DELETE /products]`, async function () {
    const data = completeDummyProduct();

    const inserted = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const productId = inserted.body.data._id;

    const req = await Request(this.server)
      .delete(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + login.token);
    expect(req.status).to.equal(202);
  });

  it(`Delete product, unauthorized [DELETE /products]`, async function () {
    const data = completeDummyProduct();

    const inserted = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const productId = inserted.body.data._id;

    const req = await Request(this.server).delete(`/products/${productId}`);
    expect(req.status).to.equal(403);
  });

  it(`Delete product, different user [DELETE /products]`, async function () {
    const data = completeDummyProduct();

    const inserted = await Request(this.server)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const productId = inserted.body.data._id;

    const user = await validAccount();
    const otherToken = await Request(this.server)
      .post(`/auth`)
      .auth(user.email, user.password);

    const req = await Request(this.server)
      .delete(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + otherToken.body.token);
    expect(req.status).to.equal(404);
  });

  it(`Successful fetch all product [GET /products]`, async function () {
    const req = await Request(this.server)
      .get(`/products`)
      .set('Authorization', 'Bearer ' + login.token);

    expect(req.status).to.equal(200);
  });
});
