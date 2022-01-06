import { Schema, model } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
});

const UserModel = model<User>('User', schema);

export default UserModel;
