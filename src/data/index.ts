import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
  const uri: string =
    process.env.MONGO_URI || `mongodb://localhost/queuing_dev`;

  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

const stop = async () => {
  disconnect();
};

export { start, stop };
