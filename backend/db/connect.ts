import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export default async function connectToMongoDB(): Promise<void> {
  let encodedUser: string;
  let encodedPassword: string;

  if (process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
    encodedUser = encodeURIComponent(process.env.MONGO_USER);
    encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
  } else {
    console.error(`Failed to encode MongoDB credentials`);
    process.exit(1);
  }

  const uri = `mongodb://${encodedUser}:${encodedPassword}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected! (${process.env.MONGO_DATABASE})`);
  } catch (e) {
    console.error(`MongoDB connection error: ${e}`);
    process.exit(1);
  }
};
