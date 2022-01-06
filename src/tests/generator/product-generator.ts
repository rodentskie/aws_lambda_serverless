import { commerce, datatype } from 'faker';
import { validAccount } from './auth-generator';
import Request from 'supertest';
import app from '../../index';

type ProductInput = {
  id?: number;
  name?: string;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const completeDummyProduct = () => {
  const data: ProductInput = {
    id: new Date().getTime(),
    name: commerce.productName(),
    price: datatype.float(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return data;
};

const validToken = async () => {
  const user = await validAccount();
  const res = await Request(app).post(`/auth`).auth(user.email, user.password);
  const data = res.body as {
    token: string;
  };
  return data;
};

export { completeDummyProduct, validToken };
