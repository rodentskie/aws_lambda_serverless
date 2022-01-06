import { completeDummyUser } from '../generator/user-generator';
import { internet } from 'faker';
import UserModel from '../../models/user';
import { encrypt } from '../../functions/secure-data';
import Request from 'supertest';
import app from '../../index';

interface User {
  name: string;
  email: string;
  password: string;
}

const validAccount = async () => {
  const user = completeDummyUser() as User;
  const data = {
    name: user.name,
    email: user.email,
    password: await encrypt(user.password ? user.password : `test`),
  };
  await UserModel.create(data);
  return user;
};

const invalidAccount = () => {
  return {
    username: internet.email(),
    password: internet.password(),
  };
};

const validToken = async () => {
  const user = await validAccount();
  const res = await Request(app).post(`/auth`).auth(user.email, user.password);
  const data = res.body as {
    token: string;
  };
  return data;
};

export { invalidAccount, validAccount, validToken };
