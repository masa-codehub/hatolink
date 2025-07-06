// ITweetRepository.js
/**
 * ツイートリポジトリのインターフェース
 */
class ITweetRepository {
  /**
   * 投稿対象のツイートを取得する
   * @returns {Promise<Array<Tweet>>}
   */
  async findScheduledTweetsToPost() {
    throw new Error('Not implemented');
  }

  /**
   * ツイートを保存する
   * @param {Tweet} tweet
   * @returns {Promise<void>}
   */
  async save(tweet) {
    throw new Error('Not implemented');
  }
}

module.exports = ITweetRepository;
