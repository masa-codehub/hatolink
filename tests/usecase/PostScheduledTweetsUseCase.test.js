// PostScheduledTweetsUseCase.test.js
const PostScheduledTweetsUseCase = require('../../hatolink/usecase/PostScheduledTweetsUseCase');

// モック用クラス
class MockTweetRepository {
  constructor(tweets = []) {
    this.tweets = tweets;
    this.saved = [];
  }
  async findScheduledTweetsToPost() {
    return this.tweets;
  }
  async save(tweet) {
    this.saved.push({ ...tweet });
  }
}

class MockTwitterApi {
  constructor({ shouldFail = false } = {}) {
    this.shouldFail = shouldFail;
    this.called = [];
  }
  async postTweet(tweet) {
    this.called.push({ ...tweet });
    if (this.shouldFail) throw new Error('API error');
  }
}

describe('PostScheduledTweetsUseCase', () => {
  it('投稿対象が存在しない場合、APIや保存処理が呼ばれない', async () => {
    const repo = new MockTweetRepository([]);
    const api = new MockTwitterApi();
    const useCase = new PostScheduledTweetsUseCase(repo, api);
    await useCase.execute();
    expect(api.called.length).toBe(0);
    expect(repo.saved.length).toBe(0);
  });

  it('投稿対象が存在する場合、APIが呼ばれ、ステータス・日時が更新され保存される', async () => {
    const tweet = { id: 1, status: '未投稿' };
    const repo = new MockTweetRepository([tweet]);
    const api = new MockTwitterApi();
    const useCase = new PostScheduledTweetsUseCase(repo, api);
    await useCase.execute();
    expect(api.called.length).toBe(1);
    expect(repo.saved.length).toBe(1);
    expect(repo.saved[0].status).toBe('投稿済');
    expect(repo.saved[0].postedAt).toBeInstanceOf(Date);
  });

  it('APIが失敗した場合、ステータスや保存処理は行われない', async () => {
    const tweet = { id: 2, status: '未投稿' };
    const repo = new MockTweetRepository([tweet]);
    const api = new MockTwitterApi({ shouldFail: true });
    const useCase = new PostScheduledTweetsUseCase(repo, api);
    await useCase.execute();
    expect(api.called.length).toBe(1);
    expect(repo.saved.length).toBe(0); // saveが呼ばれないことを明示的にアサート
    expect(tweet.status).toBe('未投稿');
  });

  it('APIが例外をスローした場合も、保存処理やステータス更新は行われない', async () => {
    const tweet = { id: 3, status: '未投稿' };
    const repo = new MockTweetRepository([tweet]);
    // postTweetが例外をスローするモック
    const api = { postTweet: async () => { throw new Error('API error'); }, called: [] };
    const useCase = new PostScheduledTweetsUseCase(repo, api);
    await useCase.execute();
    expect(repo.saved.length).toBe(0);
    expect(tweet.status).toBe('未投稿');
  });
});
