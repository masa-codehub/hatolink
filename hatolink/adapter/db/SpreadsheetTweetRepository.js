// SpreadsheetTweetRepository.js
// US-001: Googleスプレッドシート用TweetRepository実装

const ITweetRepository = require('../../usecase/ITweetRepository');
const Tweet = require('../../domain/Tweet');

/**
 * GASのSpreadsheetApp等は、テスト容易性のためラップして注入すること
 */
class SpreadsheetTweetRepository extends ITweetRepository {
  /**
   * @param {Object} spreadsheetService - GASのSpreadsheetApp等をラップしたサービス
   */
  constructor(spreadsheetService) {
    super();
    this.spreadsheetService = spreadsheetService;
  }

  /**
   * 投稿予定のツイートを全件取得
   * @returns {Promise<Tweet[]>}
   */
  async findScheduledTweetsToPost() {
    const rows = await this.spreadsheetService.getRows();
    const now = new Date(); // ★現在時刻を取得
    return rows
      .filter(row => {
        const scheduledAt = new Date(row.scheduledAt);
        return row.status === 'SCHEDULED' && scheduledAt <= now;
      })
      .map(row => Tweet.fromRow(row));
  }

  /**
   * ツイートを保存
   * @param {Tweet} tweet
   * @returns {Promise<void>}
   */
  async save(tweet) {
    await this.spreadsheetService.saveRow(tweet.toRow());
  }
}

module.exports = SpreadsheetTweetRepository;
