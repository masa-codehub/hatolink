// ITwitterApi.js
/**
 * Twitter APIアダプタのインターフェース
 */
class ITwitterApi {
  /**
   * ツイートを投稿する
   * @param {Tweet} tweet
   * @returns {Promise<void>}
   */
  async postTweet(tweet) {
    throw new Error('Not implemented');
  }
}

module.exports = ITwitterApi;
