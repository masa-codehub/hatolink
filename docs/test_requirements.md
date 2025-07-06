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
  title: "予約ツイート自動投稿ユースケースが、ビジネスルール通りに動作すること（ドメイン状態変更のカプセル化を含む）"
  description: |
    予約日時を過ぎた未投稿ツイートが、Twitterに正しく投稿され、投稿済みステータス・投稿完了日時が記録されることを検証する。
    【TASK-005対応】UseCase層がドメインオブジェクト（Tweet等）の状態を直接変更せず、必ずドメインエンティティに定義されたメソッド（例: markAsPosted）を呼び出して状態遷移を行うことを検証する。
    【TASK-004対応】APIアダプタからの失敗応答（例外含む）をUseCaseが正しく検知し、失敗時は後続のドメインオブジェクトの状態更新やリポジトリ保存処理が実行されないことを厳格に検証する。
  related_issue: "US-001, TASK-004, TASK-005"
  acceptance_criteria:
    - 投稿対象のツイートが存在する場合、APIが呼び出され、エンティティのステータスが markAsPosted() などのメソッド呼び出しで更新され、リポジトリで保存されること
    - UseCase層で tweet.status = '投稿済' のような直接的な状態変更が行われていないこと
    - markAsPosted等のメソッド呼び出しがテストでスパイ・モックにより検証されていること
    - 投稿対象が存在しない場合、API呼び出しや保存処理が実行されないこと
    - Twitter APIへの投稿が失敗した場合、エンティティのステータスが更新されず、リポジトリの保存処理も実行されないこと（TASK-004強化）
    - 上記の全てのケースを網羅する単体テストがtests/usecase/PostScheduledTweetsUseCase.test.jsに存在し、API失敗時にsaveメソッドが呼ばれないことをアサートしている
  note: |
    既存要件との重複・矛盾なし（2025-07-06時点確認済み）
    【TASK-005】本要件はUseCase層の責務分離・ドメイン不変条件カプセル化の観点で拡張

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

- id: TR-ADAPTER-002
  title: "スプレッドシートリポジトリが、仕様通りに動作し、ドメインオブジェクトを永続化できること"
  description: |
    クリーンアーキテクチャの原則に従い、adapter-dbレイヤーのSpreadsheetTweetRepositoryが、GoogleスプレッドシートとTweet集約オブジェクト間のマッピング・永続化処理を正しく実装していることを検証する。
    - ITweetRepositoryインターフェース仕様を満たすこと
    - スプレッドシートからの取得・保存が正しく行えること
    - GASのグローバルオブジェクト（SpreadsheetApp等）はadapter層でラップされ、テスト容易性が確保されていること
  related_issue: "US-001"
  acceptance_criteria:
    - SpreadsheetTweetRepositoryがITweetRepositoryインターフェースを正しく実装している
    - Tweet集約の保存・取得ロジックが網羅的にテストされ、全てのテストが成功する
    - モック化されたGASオブジェクトでテストが独立して実行できる
  note: |
    既存要件（TR-ADAPTER-001）と重複しないことを確認（2025-07-06時点）

- id: TR-INFRA-002
  title: "GASの定期実行トリガーがコードによって正しく設定されること"
  description: |
    PostScheduledTweetsUseCaseを定期的（10分ごと）に実行するトリガーが、コード（triggers.js）で冪等的に設定・管理されていること。
    トリガーの設定・削除がScriptAppサービスを通じて自動化されていること。
    テストではScriptAppをモック化し、トリガーの追加・削除ロジックの正しさを検証すること。
  related_issue: "US-001-Infra-Trigger"
  acceptance_criteria:
    - triggers.jsにrunPostScheduledTweetsエントリーポイント関数が実装されている
    - createTrigger関数が冪等にトリガーを設定できる
    - ScriptAppをモック化したテストで、トリガーの追加・削除ロジックが正しく動作すること
    - 全テストが成功する
  note: |
    既存要件と重複・矛盾なし（2025-07-06時点確認済み）

- id: TR-INFRA-003
  title: "エントリーポイントで依存性が正しく注入されること"
  description: |
    infrastructure層のエントリーポイント（triggers.js）で、SpreadsheetTweetRepositoryおよびTwitterApiAdapterが正しくインスタンス化され、PostScheduledTweetsUseCaseに依存性注入されていることを検証する。
    これにより、クリーンアーキテクチャの依存性逆転原則と、テスト容易性・保守性の向上を担保する。
  related_issue: "TASK-003"
  acceptance_criteria:
    - triggers.jsのrunPostScheduledTweets関数で、SpreadsheetTweetRepositoryとTwitterApiAdapterが正しくインスタンス化され、PostScheduledTweetsUseCaseに注入されている
    - SpreadsheetTweetRepositoryのコンストラクタに必要な依存性（spreadsheetService等）がエントリーポイントで解決されている
    - テストで依存性注入の正しさが検証され、全てのテストがパスする
  note: |
    既存要件との重複・矛盾なし（2025-07-06時点確認済み）
