# hatolink

## セットアップ手順

本プロジェクトを動作させるには、いくつかの外部サービスとの連携設定が必要です。

### 1. Twitter Developer Portalでの準備

ツイートを投稿するユーザーとして認証するためのキーを取得します。

1.  **Twitter Developer Portal**でプロジェクトとアプリを作成します。
2.  対象アプリの **[User authentication settings]** を開き、以下の設定を行います。
    - **App permissions**: `Read and Write` に変更します。（ツイート投稿の権限）
    - **Type of App**: `Web App, Automated App or Bot` を選択します。
3.  アプリの **[Keys and tokens]** タブに移動します。
4.  **[Authentication Tokens]** セクションで、以下の4つのキーとトークンを生成し、安全な場所にコピーしておきます。
    - `API Key`
    - `API Key Secret`
    - `Access Token`
    - `Access Token Secret`

### 2. Googleスプレッドシートの準備

投稿キューとして機能するスプレッドシートを用意します。

1.  新しいGoogleスプレッドシートを作成します。
2.  ブラウザのアドレスバーに表示されているURLから**スプレッドシートID**をコピーしておきます。
    - 例: `https://docs.google.com/spreadsheets/d/`**`ここに表示されている長い文字列`**`/edit`
3.  シートの1枚目のタブの名前を `Queue` に変更します。
4.  `Queue`シートの1行目に、以下のヘッダーを**A1セルから順に**入力します。

    `tweetId`, `body`, `status`, `scheduledAt`, `postedAt`, `retryCount`, `imageLinks`

### 3. Google Apps Scriptのライブラリとプロパティ設定

1.  ローカル環境で `clasp open` を実行し、GASエディタを開きます。
2.  **ライブラリの追加**:
    - 左メニューの「ライブラリ」横の`+`をクリックします。
    - 以下のスクリプトIDを貼り付けて検索し、追加します。
      - `1B7FSrk57A1B1cpOCoq2-x3-1Ns-g-hJ2Mb_g_G5o83Y1yI9Laq5M7y72`
3.  **スクリプトプロパティの設定**:
    - 左メニューの「プロジェクトの設定」（歯車アイコン）を開きます。
    - 「スクリプト プロパティ」セクションで、以下の5つのプロパティと、それぞれに対応する値を設定します。

| プロパティ名 | 値（設定する内容） |
| :--- | :--- |
| `TWITTER_API_KEY` | 手順1で取得したAPI Key |
| `TWITTER_API_SECRET` | 手順1で取得したAPI Key Secret |
| `TWITTER_ACCESS_TOKEN` | 手順1で取得したAccess Token |
| `TWITTER_ACCESS_TOKEN_SECRET`| 手順1で取得したAccess Token Secret |
| `SPREADSHEET_ID` | 手順2で取得したスプレッドシートID |

### 4. デプロイと実行

1.  ローカルで `npm run deploy` を実行し、変更をGASにプッシュします。
2.  GASエディタで `runPostScheduledTweets` を選択し、実行します。

---

## よくあるエラーと対処法

### OAuth1 is not defined エラー

- **原因**: GASプロジェクトにOAuth1ライブラリが追加されていない、または識別子が `OAuth1` になっていない場合に発生します。
- **対処法**:
  1. GASエディタで「ライブラリ」タブを開き、OAuth1ライブラリ（スクリプトID: `1B7FSrk57A1B1cpOCoq2-x3-1Ns-g-hJ2Mb_g_G5o83Y1yI9Laq5M7y72`）が追加されているか確認。
  2. 識別子が必ず `OAuth1` になっていることを確認。
  3. 追加・修正後は `npm run deploy` で再デプロイ。

### Twitter API 403 Forbidden（oauth1 app permissions）

- **原因**: Twitterアプリの「App permissions」が `Read only` になっている場合、ツイート投稿APIは403エラーになります。
- **対処法**:
  1. Twitter Developer Portalでアプリの「User authentication settings」を開く。
  2. 「App permissions」を `Read and Write` に変更。
  3. 設定変更後、「Keys and tokens」タブで `Access Token` と `Access Token Secret` を再生成し、GASのスクリプトプロパティに新しい値を設定。
  4. その後、`runPostScheduledTweets` を再実行。

---