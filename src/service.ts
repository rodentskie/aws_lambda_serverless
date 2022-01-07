import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import AuthRoute from './routes/auth';
import UserRoute from './routes/user';
import ProductRoute from './routes/products';

const app = new Koa();

app.use(cors());
app.use(bodyParser());

app.use(AuthRoute.routes());
app.use(UserRoute.routes());
app.use(ProductRoute.routes());

app.use(async (ctx) => (ctx.body = { msg: `Welcome to this API.` }));

export default app;
