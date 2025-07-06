// PostScheduledTweetsUseCase.js
/**
 * 予約ツイート自動投稿ユースケース
 *
 * ITweetRepository, ITwitterApi のインターフェースにのみ依存
 */
class PostScheduledTweetsUseCase {
  /**
   * @param {ITweetRepository} tweetRepository
   * @param {ITwitterApi} twitterApi
   */
  constructor(tweetRepository, twitterApi) {
    this.tweetRepository = tweetRepository;
    this.twitterApi = twitterApi;
  }

  /**
   * 予約ツイートを自動投稿する
   * @returns {Promise<void>}
   */
  async execute() {
    // 1. 投稿対象のツイートを取得
    const tweets = await this.tweetRepository.findScheduledTweetsToPost();
    if (!tweets || tweets.length === 0) return;

    for (const tweet of tweets) {
      try {
        // 2. Twitter APIで投稿
        await this.twitterApi.postTweet(tweet);
        // 3. 成功時: ステータス・投稿完了日時を更新
        tweet.status = '投稿済';
        tweet.postedAt = new Date();
        await this.tweetRepository.save(tweet);
      } catch (e) {
        // 失敗時: ステータスは変更しない
        // ログ等は必要に応じて追加
      }
    }
  }
}

module.exports = PostScheduledTweetsUseCase;
