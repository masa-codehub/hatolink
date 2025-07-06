// SpreadsheetTweetRepository.test.js
// US-001: SpreadsheetTweetRepositoryの単体テスト

const SpreadsheetTweetRepository = require('../../../hatolink/adapter/db/SpreadsheetTweetRepository');
const Tweet = require('../../../hatolink/domain/Tweet');
const TweetBody = require('../../../hatolink/domain/value_objects/TweetBody');
const PostStatus = require('../../../hatolink/domain/value_objects/PostStatus');

describe('SpreadsheetTweetRepository', () => {
  let repo;
  let mockSpreadsheetService;

  beforeEach(() => {
    mockSpreadsheetService = {
      getRows: jest.fn(),
      saveRow: jest.fn()
    };
    repo = new SpreadsheetTweetRepository(mockSpreadsheetService);
  });

  it('findScheduledTweetsToPost: SCHEDULEDのみ取得', async () => {
    mockSpreadsheetService.getRows.mockResolvedValue([
      { tweetId: '1', body: 'a', status: 'SCHEDULED', scheduledAt: '2025-07-06T10:00:00Z', postedAt: '', retryCount: 0, imageLinks: [] },
      { tweetId: '2', body: 'b', status: 'POSTED', scheduledAt: '2025-07-06T11:00:00Z', postedAt: '2025-07-06T12:00:00Z', retryCount: 0, imageLinks: [] }
    ]);
    const tweets = await repo.findScheduledTweetsToPost();
    expect(tweets).toHaveLength(1);
    expect(tweets[0]).toBeInstanceOf(Tweet);
    expect(tweets[0].tweetId).toBe('1');
    expect(tweets[0].status.toString()).toBe('SCHEDULED');
  });

  it('save: Tweetオブジェクトを行データに変換して保存', async () => {
    const tweet = new Tweet({
      tweetId: '3',
      body: new TweetBody('test'),
      status: new PostStatus('SCHEDULED'),
      scheduledAt: '2025-07-06T13:00:00Z',
      postedAt: '',
      retryCount: 0,
      imageLinks: []
    });
    await repo.save(tweet);
    expect(mockSpreadsheetService.saveRow).toHaveBeenCalledWith(expect.objectContaining({ tweetId: '3', body: 'test', status: 'SCHEDULED' }));
  });
});
