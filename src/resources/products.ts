import { Context } from 'koa';
import ProductModel from '../models/products';
import R from 'ramda';

type ProductInput = {
  id: string;
  name: string;
  price: number;
};

type ProductUpdateInput = {
  name: string;
  price: number;
};

const addProduct = async (ctx: Context, next: Function) => {
  const { id, name, price } = ctx.request.body as ProductInput;
  const userId = ctx.user.data._id;

  if (!userId) ctx.throw(403, `Forbidden`);

  if (!id)
    ctx.throw(400, {
      message: `Please enter product's unique ID.`,
    });

  if (!name)
    ctx.throw(400, {
      message: `Please enter product's name.`,
    });
  if (price == 0)
    ctx.throw(400, {
      message: `Please enter product's price.`,
    });

  if (typeof price !== `number`)
    ctx.throw(400, {
      message: `Please enter a valid product's price.`,
    });

  const existingProduct = await ProductModel.findOne({
    id,
  });

  if (existingProduct)
    ctx.throw(400, {
      message: `Product's ID already exist, please enter again.`,
    });

  const dateToday = new Date();

  const cursor = `${name}${id}`;

  const product = await ProductModel.create({
    id,
    name,
    price,
    createdBy: userId,
    cursor,
    createdAt: dateToday,
    updatedAt: dateToday,
  });

  ctx.status = 201;
  ctx.body = {
    data: product,
  };
};

const updateProduct = async (ctx: Context, next: Function) => {
  const productId = ctx.params.id;
  const data = ctx.request.body as ProductUpdateInput;

  if (data.name == ``) ctx.throw(400, `Please enter product's name.`);
  if (data.price <= 0) ctx.throw(400, `Please enter product's price.`);

  const userId = ctx.user.data._id;

  const product = await ProductModel.findOne({
    _id: productId,
    createdBy: userId,
  });

  if (!product) ctx.throw(404, `Not found.`);

  const dateToday = new Date();

  const cursor = `${data.name ? data.name : product.name}${product.id}`;

  const info = {
    ...data,
    cursor,
    updatedAt: dateToday,
  };

  const update = await ProductModel.findByIdAndUpdate(productId, info, {
    new: true,
  });

  if (!update) ctx.throw(400);

  ctx.status = 202;
  ctx.body = update;
};

const deleteProduct = async (ctx: Context, next: Function) => {
  const productId = ctx.params.id;

  const userId = ctx.user.data._id;

  const product = await ProductModel.findOne({
    _id: productId,
    createdBy: userId,
  });

  if (!product) ctx.throw(404, `Not found.`);

  const del = await ProductModel.findByIdAndDelete(productId);

  if (!del) ctx.throw(400);

  ctx.status = 202;
  ctx.body = del;
};

const getAllProducts = async (ctx: Context, next: Function) => {
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

  if (after === '') {
    options.sort[`createdAt`] = `asc`;
    data = await ProductModel.find({}, fields, options);
  }

  if (after !== '') {
    data = await ProductModel.find(
      {
        cursor: { $gte: after },
      },
      fields,
      options,
    );
  }

  const transformedData = R.map((obj: Object) => {
    const data = obj as {
      _id: string;
      id: string;
      name: string;
      price: number;
      cursor: string;
      createdAt: Date;
      updatedAt: Date;
    };

    const product = {
      product: {
        _id: data._id,
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
  });

  const hasPreviousPage = await ProductModel.exists({
    cursor: { $lt: after },
  });

  const totalCount = await ProductModel.countDocuments();

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

export { addProduct, updateProduct, deleteProduct, getAllProducts };
