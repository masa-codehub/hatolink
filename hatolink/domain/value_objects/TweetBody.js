// TweetBody.js
// ツイート本文値オブジェクト: 文字数制限（URL換算含む）を厳密に検証

const URL_REGEX = /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g;
const MAX_LENGTH = 140;
const URL_LENGTH = 23; // Twitter仕様

class TweetBody {
  constructor(body) {
    if (typeof body !== 'string') throw new Error('TweetBody must be a string');
    const length = TweetBody.calculateLength(body);
    if (length > MAX_LENGTH) {
      throw new Error(`ツイート本文が最大文字数(${MAX_LENGTH})を超えています: ${length}`);
    }
    this.value = body;
  }

  static calculateLength(text) {
    // URL部分を23文字、その他はそのままカウント
    let length = 0;
    let lastIndex = 0;
    const matches = [...text.matchAll(URL_REGEX)];
    for (const match of matches) {
      // URL前の部分
      length += match.index - lastIndex;
      // URL本体
      length += URL_LENGTH;
      lastIndex = match.index + match[0].length;
    }
    // 残りの部分
    length += text.length - lastIndex;
    return length;
  }

  toString() {
    return this.value;
  }
}

module.exports = TweetBody;
