import { commerce, datatype } from 'faker';

type ProductInput = {
  id?: number;
  name?: string;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const completeDummyProduct = () => {
  const data: ProductInput = {
    id: new Date().getTime(),
    name: commerce.productName(),
    price: datatype.float(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return data;
};

export { completeDummyProduct };
