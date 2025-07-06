# テスト要件定義

- id: TR-INFRA-001
  title: "プロジェクトのテスト環境が正常に動作すること"
  description: |
    クリーンアーキテクチャに基づくディレクトリ構造下で、GAS用テストフレームワーク（例: GasT）を用いたサンプルテストが正常に実行・成功すること。
  related_issue: "TASK-001"
  acceptance_criteria:
    - infrastructure/tests ディレクトリに配置されたサンプルテストが、テスト実行コマンドで全て成功する
    - テストフレームワークのセットアップ手順が明確であり、再現可能である
  note: |
    既存要件との重複・矛盾なし（2025-07-06時点確認済み）

- id: TR-USECASE-001
  title: "予約ツイート自動投稿ユースケースが、ビジネスルール通りに動作すること"
  description: |
    予約日時を過ぎた未投稿ツイートが、Twitterに正しく投稿され、投稿済みステータス・投稿完了日時が記録されることを検証する。
  related_issue: "US-001"
  acceptance_criteria:
    - 投稿対象のツイートが存在する場合、APIが呼び出され、エンティティのステータスが更新され、リポジトリで保存されること
    - 投稿対象が存在しない場合、API呼び出しや保存処理が実行されないこと
    - Twitter APIへの投稿が失敗した場合、エンティティのステータスが更新されないこと
  note: |
    既存要件との重複・矛盾なし（2025-07-06時点確認済み）

- id: TR-ADAPTER-001
  title: "Twitter APIアダプタが、仕様通りに動作し、安全に認証情報を扱えること"
  description: |
    クリーンアーキテクチャの原則に従い、usecaseレイヤーのITwitterApiインターフェースとadapter-apiレイヤーのTwitterApiAdapter実装が、
    1) ツイート投稿API呼び出し、2) 認証情報の安全な管理、3) テスト容易性（UrlFetchApp/PropertiesServiceのモック化）を満たすことを検証する。
  related_issue: "TASK-002"
  acceptance_criteria:
    - ITwitterApiインターフェースの仕様を満たす
    - 認証情報がコードにハードコーディングされていない
    - UrlFetchApp, PropertiesServiceの呼び出しがモック化されたテストが全て成功する
  note: |
    既存要件との重複・矛盾なし（2025-07-06時点確認済み）

- id: TR-DOMAIN-001
  title: "ツイート集約がドメインのルールを正しく維持できること"
  description: |
    ドメインモデル（Tweet集約ルート、TweetBody/ PostStatus値オブジェクト）が、以下の不変条件・ビジネスルールを正しく保証することを検証する。
    - TweetBody: 文字数制限（URLは23文字換算）を厳密に検証し、違反時は例外をスローする
    - PostStatus: SCHEDULED→POSTED→PERMANENT_ERRORの正しい状態遷移のみ許可し、不正な遷移は例外とする
    - Tweet: markAsPosted()等のドメインロジックが、集約の整合性を常に維持する
  related_issue: "US-001"
  acceptance_criteria:
    - Tweet, TweetBody, PostStatusの各値オブジェクト・エンティティ単体テストが存在し、全ての不変条件を網羅している
    - 受け入れ基準（requirements.yaml記載）を満たすテストケースが実装されている
    - テスト実行コマンドで全てのテストが成功する
  note: |
    既存要件との重複・矛盾なし（2025-07-06時点確認済み）
