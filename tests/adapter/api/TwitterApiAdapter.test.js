// TwitterApiAdapter.test.js
const TwitterApiAdapter = require('../../../hatolink/adapter/api/TwitterApiAdapter');

describe('TwitterApiAdapter', () => {
  let adapter;
  beforeEach(() => {
    adapter = new TwitterApiAdapter();
  });

  it('should get access token from PropertiesService if available', () => {
    global.PropertiesService = {
      getScriptProperties: () => ({
        getProperty: (key) => key === 'TWITTER_BEARER_TOKEN' ? 'dummy_token' : null
      })
    };
    const a = new TwitterApiAdapter();
    expect(a.token).toBe('dummy_token');
    delete global.PropertiesService;
  });

  it('should fallback to process.env if PropertiesService is not available', () => {
    process.env.TWITTER_BEARER_TOKEN = 'env_token';
    const a = new TwitterApiAdapter();
    expect(a.token).toBe('env_token');
    delete process.env.TWITTER_BEARER_TOKEN;
  });

  it('should call UrlFetchApp.fetch and return response', () => {
    global.UrlFetchApp = {
      fetch: jest.fn().mockReturnValue({
        getResponseCode: () => 200,
        getContentText: () => '{"id":"123","text":"hello"}'
      })
    };
    const tweet = { body: 'hello' };
    const res = adapter.postTweet(tweet);
    expect(global.UrlFetchApp.fetch).toHaveBeenCalled();
    expect(res.code).toBe(200);
    expect(JSON.parse(res.body).text).toBe('hello');
    delete global.UrlFetchApp;
  });

  it('should return 501 if UrlFetchApp is not available', () => {
    const tweet = { body: 'test' };
    const res = adapter.postTweet(tweet);
    expect(res.code).toBe(501);
  });
});
