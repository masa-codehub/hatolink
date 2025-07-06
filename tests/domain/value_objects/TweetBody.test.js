// TweetBody.test.js
const TweetBody = require('../../../hatolink/domain/value_objects/TweetBody');

describe('TweetBody', () => {
  it('140文字以内なら生成できる', () => {
    expect(() => new TweetBody('a'.repeat(140))).not.toThrow();
  });

  it('URLを23文字換算し、140文字以内ならOK', () => {
    const text = 'a'.repeat(116) + ' https://example.com'; // 116+1+23=140
    expect(() => new TweetBody(text)).not.toThrow();
  });

  it('URL換算後に140文字超なら例外', () => {
    const text = 'a'.repeat(117) + ' https://example.com'; // 117+1+23=141
    expect(() => new TweetBody(text)).toThrow();
  });

  it('URLが複数ある場合も正しく換算', () => {
    const text = 'a'.repeat(92) + ' https://a.com https://b.com'; // 92+1+23+1+23=140
    expect(() => new TweetBody(text)).not.toThrow();
  });

  it('URL以外の部分が140文字超なら例外', () => {
    const text = 'a'.repeat(141);
    expect(() => new TweetBody(text)).toThrow();
  });
});
