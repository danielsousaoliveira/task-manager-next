export default async function () {
  const globalAny = global as any;
  if (globalAny.__MONGOD_INSTANCE) {
    await globalAny.__MONGOD_INSTANCE.stop();
  }
}
