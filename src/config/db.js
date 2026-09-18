let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const mongoose = require('mongoose');
    cached.promise = mongoose.connect(process.env.MONGO_OMNI_BACK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      bufferCommands: false,
    }).then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDB };