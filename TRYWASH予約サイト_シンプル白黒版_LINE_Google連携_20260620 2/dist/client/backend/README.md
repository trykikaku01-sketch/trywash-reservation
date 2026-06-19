# TRY WASH 共通DB・LINE連携設計

## 役割分担

- WordPress: ホームページ、施工事例、ブログ、予約ボタン設置のみ。
- 予約サイト: WordPressとは独立したWebアプリ。WordPressの予約ボタン、LINE公式アカウントのリッチメニューから遷移。
- 管理画面: 予約、顧客、車両、施工履歴、スタッフ、管理者メモを管理。
- スタッフ評価システム: 予約または施工履歴に紐づく担当スタッフ・作業時間・品質評価を管理。
- 共通DB: 予約サイト、管理画面、スタッフ評価システムが同じDBを参照。

## 環境変数

`.env.example` を環境ごとにコピーして使用します。

- `APP_ENV`: `local` / `staging` / `production`
- `APP_BASE_URL`: 予約サイトURL
- `APP_ADMIN_URL`: 管理画面URL
- `WORDPRESS_URL`: WordPress本体URL
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`: DB接続情報
- `LINE_CHANNEL_ID`: LINEチャネルID
- `LINE_CHANNEL_SECRET`: LINEチャネルシークレット
- `LINE_CHANNEL_ACCESS_TOKEN`: Messaging APIアクセストークン
- `LINE_LIFF_ID`: LIFF ID
- `ADMIN_LINE_USER_ID`: 管理者通知先LINE userId
- `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`: Google Apps ScriptのWebアプリURL
- `GOOGLE_APPS_SCRIPT_SECRET`: Apps Script側と照合する投稿防止用secret
- `GOOGLE_CALENDAR_TIMEZONE`: Googleカレンダー登録時のタイムゾーン。通常は `Asia/Tokyo`

LINE APIキー、チャネルシークレット、DB接続情報、Google Apps Script webhook URL、secretはフロントに置かず、サーバー環境変数のみで管理します。

Google Calendar連携はApps Script Webアプリへ予約APIからHTTP POSTし、Apps Script側の `CalendarApp` で `trykikaku01@gmail.com` のカレンダーへ予定を作成します。予約APIはカレンダー登録の成功・失敗をログに残し、その後に既存のLINE通知キュー処理へ進みます。

Apps Script側には `google-apps-script/calendar-webhook.gs` の内容を貼り付けます。スクリプトプロパティに `GOOGLE_APPS_SCRIPT_SECRET` を設定し、WebアプリとしてデプロイしたURLを予約サイト側の `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` に設定します。Apps Scriptプロジェクトのタイムゾーンは `Asia/Tokyo` にしてください。

## フロント側の切り替え

`runtime-config.example.js` を参考に、デプロイ環境で `window.TRYWASH_CONFIG` を出力します。

```js
window.TRYWASH_CONFIG = {
  environment: "production",
  storeId: "yokosuka",
  apiBaseUrl: "https://api.example.com",
  liffId: "2006165803-oWEnewYV",
  wordpressUrl: "https://try-wash.com",
  lineEnabled: true,
};
```

`apiBaseUrl` が空の場合は、現在と同じくブラウザ内保存で動作します。
`apiBaseUrl` が設定されると、予約・通知キュー・スタッフ評価が共通APIへ同期されます。

## 必要API

### 予約

- `GET /reservations?storeId=yokosuka`
- `POST /reservations`
- `PUT /reservations/:id`
- `DELETE /reservations/:id`

保存内容:

- 予約情報
- 顧客情報
- 車両情報
- 選択メニュー
- 選択オプション
- 合計金額
- LINE userId
- 代車有無
- 施工履歴
- 担当スタッフ
- スタッフ作業計画
- 管理者メモ
- 変更履歴

### LINEユーザー

- `POST /line/users`

LIFFで取得した `lineUserId`, `displayName`, `pictureUrl` を保存します。

### メッセージ

- `POST /messages/queue`
- `GET /messages?status=pending`
- `POST /messages/:id/send`

管理画面から顧客へLINEメッセージを送る場合も `messages` に保存し、送信ワーカーがMessaging APIで送信します。

### スタッフ評価

- `GET /staff`
- `POST /staff`
- `PUT /staff/:id`
- `POST /staff/work-logs`
- `POST /staff/evaluations`
- `PUT /staff/evaluations/snapshot`

スタッフ評価は `reservations` または `staff_work_logs` と紐づけます。

## LINE通知タイミング

`messages` テーブルに `send_at` と `status=pending` で登録し、通知ワーカーが定期実行します。

- 予約完了時: 即時
- 予約前日: 入庫日の前日
- 入庫当日朝: 入庫当日 8:00 目安
- 施工完了時: 管理画面でステータスを `完了` にした時
- 施工後3日後の口コミ依頼: 完了日から3日後
- 半年後または1年後のメンテナンス案内: 完了日から6ヶ月後または12ヶ月後

## LINE送信処理

サーバー側で `LINE_CHANNEL_ACCESS_TOKEN` を使ってMessaging APIへ送信します。

送信後:

- 成功: `messages.status = 'sent'`, `sent_at = now()`
- 失敗: `messages.status = 'failed'`, `error_message` に理由を保存

フロント側にはLINEアクセストークンを置きません。

## LIFF予約フロー

1. LINE公式アカウントのリッチメニューからLIFF URLへ遷移
2. LIFF SDKで `lineUserId` を取得
3. 予約フォーム送信時に予約情報へ `lineUserId` を紐づけ
4. サーバーが `customers`, `line_users`, `vehicles`, `reservations`, `reservation_options`, `messages` を保存
5. 予約完了通知をLINEで送信

## 本番・テスト分離

- 本番: `APP_ENV=production`, production DB, production LINEチャネル
- テスト: `APP_ENV=staging`, staging DB, LINEテストチャネル
- ローカル: `APP_ENV=local`, `apiBaseUrl` 空またはローカルAPI

DB、LINEチャネル、LIFF ID、API URLは環境ごとに分けます。
