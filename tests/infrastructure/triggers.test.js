// triggers.test.js
// ScriptAppのモックとtriggers.jsのテスト

const { runPostScheduledTweets, createTrigger } = require('../../hatolink/infrastructure/triggers');
const SpreadsheetService = require('../../hatolink/adapter/db/SpreadsheetService');
const SpreadsheetTweetRepository = require('../../hatolink/adapter/db/SpreadsheetTweetRepository');
const TwitterApiAdapter = require('../../hatolink/adapter/api/TwitterApiAdapter');
const PostScheduledTweetsUseCase = require('../../hatolink/usecase/PostScheduledTweetsUseCase');

describe('triggers.js', () => {
  describe('createTrigger', () => {
    let ScriptApp;
    let triggers;
    let deleted;
    let created;

    beforeEach(() => {
      deleted = [];
      created = false;
      triggers = [
        { getHandlerFunction: () => 'runPostScheduledTweets' },
        { getHandlerFunction: () => 'otherFunction' },
      ];
      global.ScriptApp = ScriptApp = {
        getProjectTriggers: jest.fn(() => triggers),
        deleteTrigger: jest.fn(trigger => deleted.push(trigger)),
        newTrigger: jest.fn(() => ({
          timeBased: () => ({
            everyMinutes: () => ({
              create: () => { created = true; return {}; },
            }),
          }),
        })),
      };
    });

    afterEach(() => {
      delete global.ScriptApp;
    });

    it('既存の同名トリガーを削除し新規作成する', () => {
      createTrigger();
      expect(ScriptApp.getProjectTriggers).toHaveBeenCalled();
      expect(deleted.length).toBe(1);
      expect(deleted[0].getHandlerFunction()).toBe('runPostScheduledTweets');
      expect(created).toBe(true);
    });

    it('2回実行してもトリガーが重複しない', () => {
      createTrigger();
      deleted = [];
      triggers = [
        { getHandlerFunction: () => 'runPostScheduledTweets' },
      ];
      createTrigger();
      expect(deleted.length).toBe(1);
      expect(created).toBe(true);
    });
  });

  describe('runPostScheduledTweets', () => {
    let origSpreadsheetService, origTweetRepository, origTwitterApi, origUseCase;
    let called = {};

    beforeAll(() => {
      origSpreadsheetService = global.SpreadsheetService;
      origTweetRepository = global.SpreadsheetTweetRepository;
      origTwitterApi = global.TwitterApiAdapter;
      origUseCase = global.PostScheduledTweetsUseCase;
    });
    afterAll(() => {
      global.SpreadsheetService = origSpreadsheetService;
      global.SpreadsheetTweetRepository = origTweetRepository;
      global.TwitterApiAdapter = origTwitterApi;
      global.PostScheduledTweetsUseCase = origUseCase;
    });

    it('依存性が正しく注入される', () => {
      called = { service: false, repo: false, api: false, usecase: false, execute: false };
      // モック
      class MockSpreadsheetService {
        constructor() { called.service = true; }
      }
      class MockRepo {
        constructor(service) { called.repo = service instanceof MockSpreadsheetService; }
      }
      class MockApi { constructor() { called.api = true; } }
      class MockUseCase {
        constructor(repo, api) { called.usecase = repo instanceof MockRepo && api instanceof MockApi; }
        execute() { called.execute = true; }
      }
      jest.spyOn(require('../../../hatolink/adapter/db/SpreadsheetService'), 'prototype', 'get').mockReturnValue(MockSpreadsheetService.prototype);
      jest.spyOn(require('../../../hatolink/adapter/db/SpreadsheetTweetRepository'), 'prototype', 'get').mockReturnValue(MockRepo.prototype);
      jest.spyOn(require('../../../hatolink/adapter/api/TwitterApiAdapter'), 'prototype', 'get').mockReturnValue(MockApi.prototype);
      jest.spyOn(require('../../../hatolink/usecase/PostScheduledTweetsUseCase'), 'prototype', 'get').mockReturnValue(MockUseCase.prototype);

      // 実行
      require('../../../hatolink/infrastructure/triggers').runPostScheduledTweets();
      expect(called.service).toBe(true);
      expect(called.repo).toBe(true);
      expect(called.api).toBe(true);
      expect(called.usecase).toBe(true);
      expect(called.execute).toBe(true);
    });
  });
});
