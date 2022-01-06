import { Schema, model } from 'mongoose';

interface Product {
  id: string;
  name: string;
  price: number;
  createdBy: string;
  cursor: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Product>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  createdBy: { type: String, required: true },
  cursor: {
    type: String,
    index: true,
  },
  createdAt: Date,
  updatedAt: Date,
});

const ProductModel = model<Product>('Product', schema);

export default ProductModel;
