const tweetSchema = require('../models/tweet');
const { broadcast } = require('../utils/sseManager');

module.exports = {
  async index(req, res) {
    const tweets = await tweetSchema.find({}).sort('-createdAt');
    return res.json(tweets);
  },

  async store(req, res) {
    const tweet = await tweetSchema.create(req.body);
    broadcast('tweet', tweet);
    return res.json(tweet);
  }
};