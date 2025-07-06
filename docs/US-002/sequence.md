### US-002 画像付きツイート自動投稿 シーケンス図

```mermaid
sequenceDiagram
    participant Engine as 自動投稿エンジン<br>(システム)
    participant Sheet as スプレッドシート<br>(投稿キュー)
    participant GDrive as Google Drive API
    participant Twitter as Twitter API

    activate Engine
    Note over Engine: 定刻にトリガーで起動
    Engine->>Sheet: 投稿対象のツイートを要求
    activate Sheet
    Sheet-->>Engine: 対象ツイートのデータを返却
    deactivate Sheet

    alt 対象ツイートに画像リンクがある場合
        Note over Engine, GDrive: 画像データをGoogleドライブから取得
        loop 各画像URL(最大4件)に対して
            Engine->>GDrive: URLを元に画像データを要求
            activate GDrive
            GDrive-->>Engine: 画像データを返却
            deactivate GDrive
        end
        
        Engine->>Twitter: 投稿リクエスト (ツイート本文 + 画像データ)
        activate Twitter
        Twitter-->>Engine: 投稿結果 (成功)
        deactivate Twitter

    else 画像リンクがない場合 (テキストのみ)
        Engine->>Twitter: 投稿リクエスト (ツイート本文のみ)
        activate Twitter
        Twitter-->>Engine: 投稿結果 (成功)
        deactivate Twitter
    end

    Note over Engine, Sheet: 投稿成功をスプレッドシートに記録
    Engine->>Sheet: ステータスを「投稿済」に更新<br>「投稿完了日時」を記録

    deactivate Engine
```

### 図の解説

1.  **起動とデータ要求**: `自動投稿エンジン`が起動し、`スプレッドシート`から投稿すべきツイートのデータを要求します。
2.  **画像リンクの有無を判断 (alt)**:
      * **画像リンクがある場合**:
          * `エンジン`は、ツイートデータに含まれるGoogleドライブのURLを元に`Google Drive API`にアクセスします。この処理は技術タスク`TASK-003`で定義されています。
          * URLの数だけループし（`loop`）、すべての画像データを`Google Drive API`から取得します。
          * 取得したツイート本文と**画像データ**を`Twitter API`に送信して投稿します。
      * **画像リンクがない場合**:
          * US-001と同様に、ツイート本文のみを`Twitter API`に送信します。
3.  **結果の記録**: `Twitter API`から成功の応答を受け取ると、`エンジン`は`スプレッドシート`のステータスを「投稿済」に更新し、投稿日時を記録します。