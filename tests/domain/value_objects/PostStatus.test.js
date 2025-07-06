// PostStatus.test.js
const PostStatus = require('../../../hatolink/domain/value_objects/PostStatus');

describe('PostStatus', () => {
  it('SCHEDULED, POSTED, PERMANENT_ERRORのみ許可', () => {
    expect(() => new PostStatus('SCHEDULED')).not.toThrow();
    expect(() => new PostStatus('POSTED')).not.toThrow();
    expect(() => new PostStatus('PERMANENT_ERROR')).not.toThrow();
    expect(() => new PostStatus('INVALID')).toThrow();
  });

  it('SCHEDULED→POSTED遷移はOK', () => {
    const status = new PostStatus('SCHEDULED');
    expect(() => status.transition('POSTED')).not.toThrow();
  });

  it('SCHEDULED→PERMANENT_ERROR遷移はOK', () => {
    const status = new PostStatus('SCHEDULED');
    expect(() => status.transition('PERMANENT_ERROR')).not.toThrow();
  });

  it('POSTED→他遷移はNG', () => {
    const status = new PostStatus('POSTED');
    expect(() => status.transition('SCHEDULED')).toThrow();
    expect(() => status.transition('PERMANENT_ERROR')).toThrow();
  });

  it('PERMANENT_ERROR→他遷移はNG', () => {
    const status = new PostStatus('PERMANENT_ERROR');
    expect(() => status.transition('SCHEDULED')).toThrow();
    expect(() => status.transition('POSTED')).toThrow();
  });
});
