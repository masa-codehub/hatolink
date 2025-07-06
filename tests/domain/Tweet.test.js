// Tweet.test.js
const Tweet = require('../../hatolink/domain/Tweet');
const TweetBody = require('../../hatolink/domain/value_objects/TweetBody');
const PostStatus = require('../../hatolink/domain/value_objects/PostStatus');

describe('Tweet', () => {
  it('TweetBody, PostStatusをラップして生成できる', () => {
    const tweet = new Tweet({
      tweetId: 'id1',
      body: new TweetBody('test'),
      status: new PostStatus('SCHEDULED'),
      scheduledAt: '2025-07-06T12:00:00Z',
    });
    expect(tweet.body.value).toBe('test');
    expect(tweet.status.value).toBe('SCHEDULED');
  });

  it('markAsPostedでPOSTEDに遷移し、postedAtがセットされる', () => {
    const tweet = new Tweet({
      tweetId: 'id2',
      body: 'test',
      status: 'SCHEDULED',
      scheduledAt: '2025-07-06T12:00:00Z',
    });
    tweet.markAsPosted('2025-07-06T13:00:00Z');
    expect(tweet.status.value).toBe('POSTED');
    expect(tweet.postedAt.toISOString()).toBe('2025-07-06T13:00:00.000Z');
  });

  it('POSTED状態からmarkAsPostedは例外', () => {
    const tweet = new Tweet({
      tweetId: 'id3',
      body: 'test',
      status: 'POSTED',
      scheduledAt: '2025-07-06T12:00:00Z',
    });
    expect(() => tweet.markAsPosted()).toThrow();
  });

  it('markAsPermanentErrorでPERMANENT_ERRORに遷移', () => {
    const tweet = new Tweet({
      tweetId: 'id4',
      body: 'test',
      status: 'SCHEDULED',
      scheduledAt: '2025-07-06T12:00:00Z',
    });
    tweet.markAsPermanentError();
    expect(tweet.status.value).toBe('PERMANENT_ERROR');
  });

  it('PERMANENT_ERROR状態からmarkAsPermanentErrorは例外', () => {
    const tweet = new Tweet({
      tweetId: 'id5',
      body: 'test',
      status: 'PERMANENT_ERROR',
      scheduledAt: '2025-07-06T12:00:00Z',
    });
    expect(() => tweet.markAsPermanentError()).toThrow();
  });
});
