// PostStatus.js
// 投稿ステータス値オブジェクト: 正しい状態遷移のみ許可

const STATUSES = ['SCHEDULED', 'POSTED', 'PERMANENT_ERROR'];

class PostStatus {
  constructor(status) {
    if (!STATUSES.includes(status)) {
      throw new Error(`不正なステータス: ${status}`);
    }
    this.value = status;
  }

  canTransitionTo(next) {
    const transitions = {
      SCHEDULED: ['POSTED', 'PERMANENT_ERROR'],
      POSTED: [],
      PERMANENT_ERROR: [],
    };
    return transitions[this.value].includes(next);
  }

  transition(next) {
    if (!this.canTransitionTo(next)) {
      throw new Error(`不正な状態遷移: ${this.value}→${next}`);
    }
    return new PostStatus(next);
  }

  toString() {
    return this.value;
  }
}

module.exports = PostStatus;
