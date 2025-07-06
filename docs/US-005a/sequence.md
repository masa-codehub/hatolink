### US-005a 個別ツイート管理 シーケンス図

```mermaid
sequenceDiagram
    actor ContentManager as コンテンツ管理者
    participant QueueSheet as 投稿キュー（スプレッドシート）
    participant Engine as 自動投稿エンジン<br>(システム)

    ContentManager->>QueueSheet: 投稿キュー（スプレッドシート）を直接開く
    
    alt 新規ツイートの登録
        ContentManager->>QueueSheet: 新しい行を追加し、ツイート内容を入力
    end

    alt 登録ツイートの編集
        ContentManager->>QueueSheet: 「未投稿」ツイートのセルの内容を変更
    end

    alt 登録ツイートの削除
        ContentManager->>QueueSheet: 「未投稿」ツイートの行を削除
    end

    Note over ContentManager, QueueSheet: コンテンツ管理者は編集後に手動で保存する
    
    loop 定期的なシステム実行
        Engine->>QueueSheet: 投稿対象のツイートを要求
        QueueSheet-->>Engine: 現在のシートの状態を返却
    end

```

### 図の解説

1.  **直接編集**: `コンテンツ管理者`がGoogleスプレッドシート（`投稿キュー（スプレッドシート）`）を直接開いて操作します。
2.  **３つの操作 (alt)**:
      * **新規登録**: コンテンツ管理者は新しい行を追加し、ツイートの本文や登録日時などを入力します。
      * **編集**: 既存の「未投稿」ツイートの行を見つけ、そのセルの内容を書き換えます。
      * **削除**: 不要になった「未投稿」ツイートの行を削除します。
3.  **定期的な読み込み (loop)**:
      * `自動投稿エンジン`は、これらの手動操作とは非同期に、定められたスケジュールで定期的に`投稿キュー（スプレッドシート）`にアクセスします。
      * アクセスした時点でのシートの状態（追加・変更・削除が反映された最新の状態）を読み込み、それを元に投稿処理を実行します。