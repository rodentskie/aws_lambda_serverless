import { internet, name } from 'faker';

type UserInput = {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const completeDummyUser = () => {
  const data: UserInput = {
    name: name.findName(),
    email: internet.email(),
    password: internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return data;
};

export { completeDummyUser };
