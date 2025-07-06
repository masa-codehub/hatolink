// triggers.test.js
// ScriptAppのモックとtriggers.jsのテスト

const { runPostScheduledTweets, createTrigger } = require('../../hatolink/infrastructure/triggers');

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
});
