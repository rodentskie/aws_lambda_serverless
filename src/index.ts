import exitHook from 'async-exit-hook';
import * as server from './server';

const delay = async (sec: number) => {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

server.start();

exitHook(async (callback: () => void) => {
  await server.stop();
  await delay(10);
  callback();
});

exitHook.uncaughtExceptionHandler(async () => {
  await delay(10);
  process.exit(-1);
});
