import mongoose from "mongoose";
import app from "../server";
import Task from "../models/Tasks";
import User from "../models/User";

export const connectTestDb = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export const clearDatabase = async () => {
  await Promise.all([Task.deleteMany({}), User.deleteMany({})]);
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export default app;
