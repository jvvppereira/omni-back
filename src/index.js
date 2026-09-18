const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { addClient, removeClient } = require('./utils/sseManager');

const app = express();

app.use((req, res, next) => {
  req.sse = { addClient, removeClient };
  return next();
});

app.use(cors());
app.use(express.json());

let dbConnected = false;
async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

app.use(require('./routes'));

module.exports = app;