import Koa from 'koa';
import dotenv from 'dotenv';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import AuthRoute from './routes/auth';
import UserRoute from './routes/user';
import ProductRoute from './routes/products';
import * as db from './data/index';
import { Server } from 'http';

dotenv.config();
let server: Server;

const start = async () => {
  const app = new Koa();

  await db.start();

  app.use(cors());
  app.use(bodyParser());

  app.use(AuthRoute.routes());
  app.use(UserRoute.routes());
  app.use(ProductRoute.routes());

  app.use(async (ctx) => (ctx.body = { msg: `Welcome to this API.` }));

  const port = process.env.PORT || 5000;

  server = app.listen(port, () => {
    console.log(`🚀⚙️  Server ready at http://localhost:${port}`);
  });

  return { server, app };
};

const stop = async () => {
  await new Promise((resolve) => server.close(resolve));
  await db.stop();
};

export { start, stop };
