// triggers.js
// US-001-Infra-Trigger: PostScheduledTweetsUseCaseの定期実行トリガー設定

const { PostScheduledTweetsUseCase } = require('../usecase/PostScheduledTweetsUseCase');
const { SpreadsheetTweetRepository } = require('../adapter/db/SpreadsheetTweetRepository');
const { TwitterApiAdapter } = require('../adapter/api/TwitterApiAdapter');
const SpreadsheetService = require('../adapter/db/SpreadsheetService');

/**
 * PostScheduledTweetsUseCaseを実行するエントリーポイント
 */
function runPostScheduledTweets() {
  const spreadsheetService = new SpreadsheetService();
  const tweetRepository = new SpreadsheetTweetRepository(spreadsheetService);
  const twitterApi = new TwitterApiAdapter();
  const useCase = new PostScheduledTweetsUseCase(tweetRepository, twitterApi);
  useCase.execute();
}

/**
 * 10分ごとのトリガーを冪等に設定する
 * 既存の同名トリガーを削除してから新規作成
 */
function createTrigger() {
  const functionName = 'runPostScheduledTweets';
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyMinutes(10)
    .create();
}

module.exports = {
  runPostScheduledTweets,
  createTrigger,
};
