const express = require('express');

const routes = express.Router();
const { addClient, removeClient } = require('./utils/sseManager');

const tweetController = require('./controllers/tweetController');
const likeController = require('./controllers/likeController');

routes.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

routes.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  addClient(res);
  req.on('close', () => removeClient(res));
});

routes.get('/tweets', tweetController.index);
routes.post('/tweets', tweetController.store);
routes.post('/likes/:id', likeController.store);

module.exports = routes;