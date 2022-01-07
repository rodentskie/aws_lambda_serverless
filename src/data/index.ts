import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const start = () => {
  const uri: string =
    process.env.MONGO_URI || `mongodb://localhost/queuing_dev`;

  console.log(`URI is ${uri}`);

  connect(uri, {
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
