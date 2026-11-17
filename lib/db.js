const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

// Serverless functions are frozen/reused between requests, so keep the
// connection (and the in-flight promise) on `global` to avoid opening a new
// connection on every invocation.
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set");
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log("MongoDB Connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow retry on next request
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
