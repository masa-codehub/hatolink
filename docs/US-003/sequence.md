### US-003 投稿失敗記録 シーケンス図

```mermaid
sequenceDiagram
    participant Engine as 自動投稿エンジン<br>(システム)
    participant Twitter as Twitter API
    participant LogSheet as エラーログシート
    participant QueueSheet as 投稿キュー（スプレッドシート）

    Note over Engine, Twitter: 投稿処理中にエラー発生
    Twitter-->>Engine: エラー応答を返却
    
    activate Engine
    Note over Engine, LogSheet: 失敗情報をエラーログに記録
    Engine->>LogSheet: 「日時」「対象ツイートID」「エラー理由」を追記
    
    Note over Engine, QueueSheet: 元のツイートの情報を確認・更新
    Engine->>QueueSheet: 対象ツイートのリトライ回数を要求
    activate QueueSheet
    QueueSheet-->>Engine: 現在のリトライ回数を返却
    deactivate QueueSheet

    alt リトライ回数が上限未満の場合
        Engine->>QueueSheet: リトライ回数を+1して更新
        activate QueueSheet
        QueueSheet-->>Engine: 更新完了
        deactivate QueueSheet
        Note over Engine: ステータスは「未投稿」のまま次回の再試行を待つ
    else リトライ回数が上限に達した場合
        Engine->>QueueSheet: ステータスを「恒久エラー」に更新
        activate QueueSheet
        QueueSheet-->>Engine: 更新完了
        deactivate QueueSheet
        Note over Engine: このツイートは以降の処理対象から除外される
    end

    deactivate Engine
```

### 図の解説

1.  **エラー発生**: `自動投稿エンジン`が`Twitter API`へ投稿をリクエストした際、`Twitter API`からエラー応答が返されます。
2.  **エラーログ記録**: `エンジン`は、まず`エラーログシート`にエラー情報を記録します。記録内容は失敗日時、対象ツイートID、エラー理由です。
3.  **リトライ回数確認**: 次に`エンジン`は、元の`投稿キュー（スプレッドシート）`にアクセスし、失敗ツイートの現在のリトライ回数を取得します。
4.  **条件分岐 (alt)**:
      * **リトライ回数が上限未満の場合**: `エンジン`はリトライ回数を+1して更新します。ステータスは「未投稿」のままなので、次回のシステム起動時に再度投稿が試みられます。
      * **リトライ回数が上限に達した場合**: `エンジン`はステータスを「恒久エラー」に更新します。これにより、このツイートは今後の自動投稿処理から除外されます。