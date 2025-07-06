## 実装完了報告: TASK-004 [Refactoring] APIアダプタとUseCase間のエラーハンドリングの不整合を修正

Issue `https://github.com/masa-codehub/hatolink/issues/TASK-004` (仮) の実装が完了しました。ご確認をお願いします。

### 主な変更点

今回のタスクで作成・変更した主要なファイルは以下の通りです。

- `hatolink/adapter/api/TwitterApiAdapter.js`
- `hatolink/usecase/PostScheduledTweetsUseCase.js`
- `tests/usecase/PostScheduledTweetsUseCase.test.js`

### テストと検証

- `test_requirements.md` の既存要件 `TR-USECASE-001` を、本リファクタリングで強化されたエラーハンドリングを検証する形で更新しました。
- 上記要件を網羅するテストケースを実装し、全てのテストがパスすることを確認済みです。
- 上記に加え、策定された**完了定義（DoD）の全ての項目をクリア**していることを確認済みです。

### 設計上の判断と学習事項

実装にあたり、以下の点を考慮・判断しました。

- **【責務の明確化】**
  - これまで`TwitterApiAdapter`はHTTPレスポンスをそのまま返していましたが、これではUseCase層がHTTPの仕様を意識する必要があり、責務が曖昧でした。
  - 今回のリファクタリングでは、AdapterがHTTPのエラーレスポンス（4xx, 5xx等）を検知して明確に例外をスローする責務を負うように修正しました。
  - これにより、UseCase層は`try-catch`でAPIの失敗をシンプルに捕捉し、ビジネスフローの制御に専念できるようになりました。この設計はクリーンアーキテクチャの依存関係のルールをより強化するものです。
- **【新規コーディングルールの追加】**
  - **今回の実装プロセスで得られた知見から、再発防止のため `coding-rules.yml` に以下のルールを追加しました。**
    - `CR-010: Adapterは外部エラーを抽象化し、UseCaseに伝える`

### レビュー依頼

特に以下の点について、重点的にレビューいただけますと幸いです。

- `TwitterApiAdapter`と`PostScheduledTweetsUseCase`間での、エラーハンドリングにおける責務分担は適切か。
- `tests/usecase/PostScheduledTweetsUseCase.test.js`のテストケースが、API失敗時に後続処理（ステータス更新やDB保存）が実行されないことを、副作用として正しく検証できているか。

ご確認のほど、よろしくお願いいたします。

---
TASK_COMPLETED
