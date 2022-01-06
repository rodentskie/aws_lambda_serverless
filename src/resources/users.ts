import { Context } from 'koa';
import UserModel from '../models/user';
import { generateToken } from '../functions/create-token';
import { encrypt } from '../functions/secure-data';
import ProductModel from '../models/products';
import R from 'ramda';

type UserInput = {
  name: string;
  email: string;
  password: string;
};

const addUser = async (ctx: Context) => {
  const { name, email, password } = ctx.request.body as UserInput;

  if (!name)
    ctx.throw(400, {
      message: `Please enter user's name.`,
    });
  if (!email)
    ctx.throw(400, {
      message: `Please enter user's email.`,
    });
  if (!password)
    ctx.throw(400, {
      message: `Please enter user's password.`,
    });

  const existingEmail = await UserModel.findOne({
    email,
  }).exec();

  if (existingEmail)
    ctx.throw(400, {
      message: `User's email already exist, please try again.`,
    });

  const user = await UserModel.create({
    name,
    email,
    password: await encrypt(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const token = generateToken(user);
  ctx.status = 201;
  ctx.body = { token };
};

const getProductsPerUser = async (ctx: Context, next: Function) => {
  const userId = ctx.params.id;

  const queries: object = ctx.request.query;
  let {
    first = 5,
    after = ``,
    sort = `name`,
    order = `asc`,
  } = queries as {
    first: number;
    after: string;
    sort: string;
    order: string;
  };

  const fields = [
    `_id`,
    `id`,
    `name`,
    `price`,
    `cursor`,
    `createdAt`,
    `updatedAt`,
  ];

  const options = {
    limit: parseInt(first.toString()),
    sort: {
      [`${sort}`]: order,
    },
  };

  let data: Array<Object> = [];

  const filter = {
    cursor: { $gte: after },
    createdBy: userId,
  };

  if (after === '') {
    options.sort[`createdAt`] = `asc`;
    data = await ProductModel.find({ createdBy: userId }, fields, options);
  }

  if (after !== '') {
    data = await ProductModel.find(filter, fields, options);
  }

  const transformedData = R.map((obj: Object) => {
    const data = obj as {
      id: string;
      name: string;
      price: number;
      cursor: string;
      createdAt: Date;
      updatedAt: Date;
    };

    const product = {
      product: {
        id: data.id,
        name: data.name,
        price: data.price,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      cursor: data.cursor,
    };

    return product;
  }, data);

  if (transformedData.length == 0) {
    ctx.status = 200;
    ctx.body = {
      products: transformedData,
    };
    return ctx;
  }

  const startCursor = R.head(transformedData)!.cursor;
  const endCursor = R.last(transformedData)!.cursor;

  const hasNextPage = await ProductModel.exists({
    cursor: { $gt: endCursor },
    createdBy: userId,
  });

  const hasPreviousPage = await ProductModel.exists({
    cursor: { $lt: after },
    createdBy: userId,
  });

  const totalCount = await ProductModel.countDocuments({
    createdBy: userId,
  });

  const pageInfo = {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
    totalCount,
  };
  ctx.status = 200;
  ctx.body = {
    products: transformedData,
    pageInfo,
  };
};

export { addUser, getProductsPerUser };
