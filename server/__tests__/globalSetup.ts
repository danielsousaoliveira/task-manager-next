import { MongoMemoryServer } from "mongodb-memory-server";

export default async function () {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.ENCRYPTION_SECRET_KEY = "test-encryption-key";
  process.env.PORT = "5000";

  // Store the MongoMemoryServer instance so globalTeardown can stop it
  const globalAny = global as any;
  globalAny.__MONGOD_INSTANCE = mongod;
}
