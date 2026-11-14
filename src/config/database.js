const mongoose = require('mongoose');

let pendingConnection = null;

function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection.getClient());
  }

  if (!pendingConnection) {
    pendingConnection = mongoose.connect(process.env.CONNECTIONSTRING, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      bufferCommands: false
    }).then(() => {
      console.info('MongoDB conectado');
      return mongoose.connection.getClient();
    }).catch((error) => {
      console.error('Falha na conexão MongoDB:', error.message);
      throw error;
    }).finally(() => {
      pendingConnection = null;
    });
  }
  return pendingConnection;
}

module.exports = { connectDB };
