TRY WASH 予約サイト シンプル白黒版

このフォルダは、横須賀店・横浜店の予約サイト、LINE導線、Google Apps Script連携、白背景ロゴ、店舗選択ページの横並びマップ、必須/任意表示、未入力項目の自動表示を入れた最新版です。

今回のカレンダー表示:
- 予約ページを開くと、最初から本日から1ヶ月分の予約カレンダーを表示します。
- 予約できる日は「空きあり」と表示します。
- 空きが少ない日は「残りわずか」と表示します。
- 予約できない日は「予約不可」と表示し、暗めの色で分かりやすくしています。

主なページ:
- index.html / reserve.html: 店舗選択
- yokosuka.html: 横須賀店予約ページ
- yokohama.html: 横浜店予約ページ
- admin.html: 予約管理画面
- reservation-board.html: 予約状況ボード

Googleカレンダー連携:
- google-apps-script/calendar-webhook.gs
  Apps Scriptに貼り付ける本番コードです。

公開用:
- dist/
  Sites等へ公開するためのビルド済みファイルです。

注意:
- .env は秘密情報が入るため、このZIPには入れていません。
- Google Apps Script URLやsecretは、公開環境のサーバー側環境変数に設定してください。
