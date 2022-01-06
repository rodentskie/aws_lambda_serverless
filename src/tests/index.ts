import * as service from '../service';

before(async function () {
  const { server } = await service.start();
  this.server = server;
});

after(async function () {
  await service.stop();
});
