const tweetSchema = require("../models/tweet");

module.exports = {
  async index(req, res) {
    const tweets = await tweetSchema.find({}).sort("-createdAt");

    return res.json(tweets);
  },

  async store(req, res) {
    const tweet = await tweetSchema.create(req.body);

    req.io.emit("tweet", tweet);

    return res.json(tweet);
  }
};
