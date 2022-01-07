import { Server } from 'http';
import dotenv from 'dotenv';
import * as db from './data/index';
import app from './service';

dotenv.config();
let server: Server;

const start = async () => {
  const port = process.env.PORT || 5000;

  server = app.listen(port, () => {
    console.log(`🚀⚙️  Server ready at http://localhost:${port}`);
  });

  return server;
};

const stop = async () => {
  await new Promise((resolve) => server.close(resolve));
  db.stop();
};

export { start, stop };
