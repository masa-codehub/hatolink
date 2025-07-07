// TwitterApiAdapter.js
// ITwitterApiインターフェースの実装。GASのUrlFetchApp/PropertiesServiceを利用

const ITwitterApi = require('../../usecase/ITwitterApi');

/**
 * Twitter APIアダプタ (OAuth 1.0a)
 * @implements {ITwitterApi}
 */
class TwitterApiAdapter extends ITwitterApi {
  constructor() {
    super();
    // スクリプトプロパティから認証情報を取得
    const props = PropertiesService.getScriptProperties();
    this.consumerKey = props.getProperty('TWITTER_API_KEY');
    this.consumerSecret = props.getProperty('TWITTER_API_SECRET');
    this.accessToken = props.getProperty('TWITTER_ACCESS_TOKEN');
    this.accessTokenSecret = props.getProperty('TWITTER_ACCESS_TOKEN_SECRET');

    this.oAuthService = this.createOAuthService();
  }

  /**
   * OAuth1サービスを生成・設定する
   * @returns {OAuth1}
   */
  createOAuthService() {
    return OAuth1.createService('Twitter')
      .setConsumerKey(this.consumerKey)
      .setConsumerSecret(this.consumerSecret)
      .setAccessToken(this.accessToken, this.accessTokenSecret)
      .setCallbackFunction('authCallback'); // ライブラリ仕様上、ダミーのコールバック関数が必要
  }

  /**
   * ツイートを投稿する
   * @param {import('../../domain/Tweet')} tweet - ドメインのTweetオブジェクト
   * @returns {Object} - APIからのレスポンス
   * @throws {Error} API失敗時
   */
  postTweet(tweet) {
    const url = 'https://api.twitter.com/2/tweets';
    const payload = {
      text: tweet.body.toString(),
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    Logger.log(`[TwitterApiAdapter] Posting to Twitter...`);
    // OAuth1ライブラリを使って署名付きリクエストを送信
    const response = this.oAuthService.fetch(url, options);
    const code = response.getResponseCode();
    const body = response.getContentText();

    if (code < 200 || code >= 300) {
      Logger.log(`[TwitterApiAdapter] ★★★ Twitter API Error: ${code} - ${body}`);
      throw new Error(`Twitter API error: ${code} - ${body}`);
    }

    Logger.log(`[TwitterApiAdapter] Twitter API Success: ${body}`);
    return JSON.parse(body);
  }
}

// OAuth1ライブラリが要求するダミーのコールバック関数。中身は空でよい。
function authCallback(request) {
  // do nothing
}

module.exports = TwitterApiAdapter;
