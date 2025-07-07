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
    // ▼▼▼▼▼ ここからログ出力コードを追加 ▼▼▼▼▼
    Logger.log('--- UseCase Execution Start ---');

    // 1. 投稿対象のツイートを取得
    const tweets = await this.tweetRepository.findScheduledTweetsToPost();

    if (!tweets || tweets.length === 0) {
      Logger.log('投稿対象のツイートが見つかりませんでした。処理を終了します。');
      return;
    }

    Logger.log(`投稿対象のツイートが ${tweets.length} 件見つかりました。`);

    for (const tweet of tweets) {
      Logger.log(`処理中のツイートID: ${tweet.tweetId}`);
      try {
        // 2. Twitter APIで投稿
        Logger.log(`  -> 投稿試行: "${tweet.body.toString()}"`);
        await this.twitterApi.postTweet(tweet);
        Logger.log(`  -> 投稿成功`);

        // 3. 成功時: ステータス・投稿完了日時を更新
        tweet.markAsPosted(new Date());
        Logger.log(`  -> 投稿済みステータスに更新`);
        await this.tweetRepository.save(tweet);
        Logger.log(`  -> 保存成功`);
      } catch (e) {
        // 失敗時
        Logger.log(`  -> ★エラー発生★ tweetId: ${tweet.tweetId}`);
        Logger.log(`  -> エラー詳細: ${e.message}`);
        Logger.log(`  -> スタックトレース: ${e.stack}`);
      }
    }
    Logger.log('--- UseCase Execution End ---');
    // ▲▲▲▲▲ ここまでログ出力コードを追加 ▲▲▲▲▲
  }
}

module.exports = PostScheduledTweetsUseCase;
