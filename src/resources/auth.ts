import auth from 'basic-auth';
import UserModel from '../models/user';
import { generateToken } from '../functions/create-token';
import { compareData } from '../functions/secure-data';
import { Context } from 'koa';

const authUser = async (ctx: Context) => {
  const getCredentials = auth(ctx.req);

  const userCredentials = {
    email: getCredentials?.name,
    password: getCredentials!.pass,
  };

  const userData = await UserModel.findOne({
    email: userCredentials.email,
  }).exec();

  if (!userData)
    ctx.throw(400, {
      message: `Incorrect email or password, please try again.`,
    });

  const isCorrectPassword = await compareData(
    userCredentials.password!,
    userData!.password,
  );

  if (!isCorrectPassword)
    ctx.throw(400, {
      message: `Incorrect email or password, please try again.`,
    });
  const token = generateToken(userData);
  ctx.status = 200;
  ctx.body = { token };
};

export { authUser };
