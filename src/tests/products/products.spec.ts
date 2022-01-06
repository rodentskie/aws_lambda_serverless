import app from '../../index';
import Request from 'supertest';
import { expect } from 'chai';
import {
  completeDummyProduct,
  validToken,
} from '../generator/product-generator';

type auth = {
  token: string;
};

let login: auth;

before(async () => {
  login = await validToken();
});

describe(`Products test suite.`, () => {
  it(`Successful add product [POST /products]`, async () => {
    const req = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(completeDummyProduct());
    expect(req.status).to.equal(201);
  });

  it(`Add product, unauthorized [POST /products]`, async () => {
    const req = await Request(app)
      .post(`/products`)
      .send(completeDummyProduct());
    expect(req.status).to.equal(403);
  });

  it(`Add product, missing unique ID [POST /products]`, async () => {
    const data = completeDummyProduct();
    delete data.id;

    const req = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add product, missing product name [POST /products]`, async () => {
    const data = completeDummyProduct();
    delete data.name;

    const req = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add product, missing product price [POST /products]`, async () => {
    const data = completeDummyProduct();
    delete data.price;

    const req = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Add product, product ID already exist [POST /products]`, async () => {
    const data = completeDummyProduct();

    await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const req = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(400);
  });

  it(`Successful update product [PATCH /products]`, async () => {
    const data = completeDummyProduct();

    const inserted = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    delete data.id;
    delete data.createdAt;

    const productId = inserted.body.data._id;

    const req = await Request(app)
      .patch(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);
    expect(req.status).to.equal(202);
  });

  it(`Update product, unauthorized [PATCH /products]`, async () => {
    const data = completeDummyProduct();

    const inserted = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    delete data.id;
    delete data.createdAt;

    const productId = inserted.body.data._id;

    const req = await Request(app).patch(`/products/${productId}`).send(data);
    expect(req.status).to.equal(403);
  });

  it(`Update product, different user [PATCH /products]`, async () => {
    const data = completeDummyProduct();

    const inserted = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    delete data.id;
    delete data.createdAt;

    const productId = inserted.body.data._id;

    const otherToken = await validToken();
    const req = await Request(app)
      .patch(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + otherToken.token)
      .send(data);
    expect(req.status).to.equal(404);
  });

  it(`Successful delete product [DELETE /products]`, async () => {
    const data = completeDummyProduct();

    const inserted = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const productId = inserted.body.data._id;

    const req = await Request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + login.token);
    expect(req.status).to.equal(202);
  });

  it(`Delete product, unauthorized [DELETE /products]`, async () => {
    const data = completeDummyProduct();

    const inserted = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const productId = inserted.body.data._id;

    const req = await Request(app).delete(`/products/${productId}`);
    expect(req.status).to.equal(403);
  });

  it(`Delete product, different user [DELETE /products]`, async () => {
    const data = completeDummyProduct();

    const inserted = await Request(app)
      .post(`/products`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(data);

    const productId = inserted.body.data._id;

    const otherToken = await validToken();

    const req = await Request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', 'Bearer ' + otherToken.token);
    expect(req.status).to.equal(404);
  });

  it(`Successful fetch all product [GET /products]`, async () => {
    const req = await Request(app).get(`/products`);
    expect(req.status).to.equal(200);
  });
});
