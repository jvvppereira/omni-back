const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(
  'mongodb://omni-back-user:user123@ds129045.mlab.com:29045/heroku_lhjkr4rz',
  {
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(require('./routes'));

server.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});
