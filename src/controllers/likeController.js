const tweetSchema = require('../models/tweet');
const { broadcast } = require('../utils/sseManager');

module.exports = {
  async store(req, res) {
    const tweet = await tweetSchema.findById(req.params.id);

    tweet.set({
      likes: tweet.likes + 1
    });

    await tweet.save();

    broadcast('like', tweet);

    return res.json(tweet);
  }
};