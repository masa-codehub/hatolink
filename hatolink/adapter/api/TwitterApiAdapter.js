// TwitterApiAdapter.js
// ITwitterApiインターフェースの実装。GASのUrlFetchApp/PropertiesServiceを利用

const ITwitterApi = require('../../usecase/ITwitterApi');

/**
 * Twitter APIアダプタ
 * @implements {ITwitterApi}
 */
class TwitterApiAdapter extends ITwitterApi {
  constructor() {
    super();
    // 認証情報はPropertiesServiceから取得
    this.token = this.getAccessToken();
  }

  /**
   * PropertiesServiceからアクセストークンを取得
   */
  getAccessToken() {
    if (typeof PropertiesService !== 'undefined') {
      const props = PropertiesService.getScriptProperties();
      return props.getProperty('TWITTER_BEARER_TOKEN');
    }
    // テスト時やNode環境用のフェールセーフ
    return process.env.TWITTER_BEARER_TOKEN || '';
  }

  /**
   * ツイートを投稿する
   * @param {Object} tweet
   * @returns {Object}
   * @throws {Error} API失敗時
   */
  postTweet(tweet) {
    const url = 'https://api.twitter.com/2/tweets';
    const payload = JSON.stringify({ text: tweet.body });
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      payload,
      muteHttpExceptions: true
    };
    if (typeof UrlFetchApp !== 'undefined') {
      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      const body = response.getContentText();
      if (code < 200 || code >= 300) {
        throw new Error(`Twitter API error: ${code} - ${body}`);
      }
      return { code, body };
    }
    // テスト/Node環境用フェールセーフ
    throw new Error('UrlFetchApp not available');
  }
}

module.exports = TwitterApiAdapter;
