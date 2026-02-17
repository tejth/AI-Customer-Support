import mongoose from "mongoose"

const mongoUrl = process.env.MONGODB_URL

if (!mongoUrl) {
  throw new Error("MONGODB_URL not defined")
}

let cache = (global as any).mongoose

if (!cache) {
  cache = (global as any).mongoose = {
    conn: null,
    promise: null,
  }
}

const connectDb = async () => {
  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUrl).then((mongoose) => {
      return mongoose
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}

export default connectDb
