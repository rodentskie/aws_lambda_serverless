import * as server from '../server';

before(async function () {
  const app = await server.start();
  this.server = app;
});

after(async function () {
  await server.stop();
});
