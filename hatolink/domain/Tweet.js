// Tweet.js
// 集約ルートエンティティ: Tweet
const TweetBody = require('./value_objects/TweetBody');
const PostStatus = require('./value_objects/PostStatus');

class Tweet {
  constructor({ tweetId, body, status, scheduledAt, postedAt, retryCount = 0, imageLinks = [] }) {
    if (!tweetId) throw new Error('tweetIdは必須');
    this.tweetId = tweetId;
    this.body = body instanceof TweetBody ? body : new TweetBody(body);
    this.status = status instanceof PostStatus ? status : new PostStatus(status);
    this.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    this.postedAt = postedAt ? new Date(postedAt) : null;
    this.retryCount = retryCount;
    this.imageLinks = imageLinks;
  }

  markAsPosted(postedAt = new Date()) {
    if (!this.status.canTransitionTo('POSTED')) {
      throw new Error('このツイートは投稿済みにできません');
    }
    this.status = this.status.transition('POSTED');
    this.postedAt = new Date(postedAt);
  }

  markAsPermanentError() {
    if (!this.status.canTransitionTo('PERMANENT_ERROR')) {
      throw new Error('このツイートは恒久エラーにできません');
    }
    this.status = this.status.transition('PERMANENT_ERROR');
  }
}

module.exports = Tweet;
