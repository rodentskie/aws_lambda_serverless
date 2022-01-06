import Koa from 'koa';
import dotenv from 'dotenv';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import AuthRoute from './routes/auth';
import UserRoute from './routes/user';
import ProductRoute from './routes/products';
import { dbConn } from './data/index';

dotenv.config();
const app = new Koa();

dbConn();

app.use(cors());
app.use(bodyParser());

const PORT = process.env.PORT || 3000;

app.use(AuthRoute.routes());
app.use(UserRoute.routes());
app.use(ProductRoute.routes());

const server = app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}.`),
);

app.use(async (ctx) => (ctx.body = { msg: `Welcome to this API.` }));

export = server;
