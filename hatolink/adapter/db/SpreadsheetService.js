// hatolink/adapter/db/SpreadsheetService.js
// GASのSpreadsheetAppをラップするサービス

class SpreadsheetService {
  constructor(sheetName = 'Queue') {
    // ▼▼▼▼▼ ここからログ出力コードを追加 ▼▼▼▼▼
    Logger.log(`[SpreadsheetService] 初期化開始。対象シート名: "${sheetName}"`);
    try {
      if (typeof SpreadsheetApp !== 'undefined') {
        const props = PropertiesService.getScriptProperties();
        const spreadsheetId = props.getProperty('SPREADSHEET_ID');
        Logger.log(`[SpreadsheetService] スプレッドシートID: ${spreadsheetId} を開きます。`);
        
        if (!spreadsheetId) {
          throw new Error("スクリプトプロパティに 'SPREADSHEET_ID' が設定されていません。");
        }

        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        Logger.log(`[SpreadsheetService] スプレッドシートを開きました: "${spreadsheet.getName()}"`);

        this.sheet = spreadsheet.getSheetByName(sheetName);
        if (!this.sheet) {
          throw new Error(`指定されたシート名 "${sheetName}" が見つかりませんでした。`);
        }
        Logger.log(`[SpreadsheetService] シートを取得しました: "${this.sheet.getName()}"`);

      } else {
        Logger.log('[SpreadsheetService] テスト環境のため、SpreadsheetAppは利用できません。');
        this.sheet = null;
      }
    } catch (e) {
      Logger.log(`[SpreadsheetService] ★★★ 初期化中にエラーが発生: ${e.message}`);
      this.sheet = null;
    }
    // ▲▲▲▲▲ ここまでログ出力コードを追加 ▲▲▲▲▲
  }

  async getRows() {
    Logger.log('[SpreadsheetService] getRows: 行データの取得を開始します。');
    if (!this.sheet) {
      Logger.log('[SpreadsheetService] getRows: シートオブジェクトが見つからないため、処理を中断します。');
      return [];
    }

    const data = this.sheet.getDataRange().getValues();
    Logger.log(`[SpreadsheetService] getRows: ヘッダーを含め ${data.length} 行のデータを取得しました。`);

    if (data.length < 1) {
        Logger.log('[SpreadsheetService] getRows: シートが空です。');
        return [];
    }

    const headers = data.shift();
    Logger.log(`[SpreadsheetService] getRows: 検出されたヘッダー: [${headers.join(', ')}]`);

    const rowObjects = data.map(row => {
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index];
      });
      return rowObject;
    });

    Logger.log(`[SpreadsheetService] getRows: ${rowObjects.length} 件のデータ行を処理しました。`);
    return rowObjects;
  }

  async saveRow(rowObj) {
    Logger.log(`[SpreadsheetService] saveRow: tweetId: ${rowObj.tweetId} の保存処理を開始します。`);
    if (!this.sheet) {
      Logger.log('[SpreadsheetService] saveRow: シートオブジェクトが見つからないため、処理を中断します。');
      return;
    }

    try {
      const headers = this.sheet.getRange(1, 1, 1, this.sheet.getLastColumn()).getValues()[0];
      const idColumnIndex = headers.indexOf('tweetId');

      if (idColumnIndex === -1) {
        throw new Error("ヘッダーに 'tweetId' が見つかりませんでした。");
      }

      const data = this.sheet.getDataRange().getValues();
      let updated = false;

      for (let i = 1; i < data.length; i++) {
        if (data[i][idColumnIndex] === rowObj.tweetId) {
          const rowValues = headers.map(header => rowObj[header] || '');
          this.sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
          Logger.log(`[SpreadsheetService] saveRow: ${i + 1} 行目を更新しました (tweetId: ${rowObj.tweetId})`);
          updated = true;
          break;
        }
      }

      if (!updated) {
        Logger.log(`[SpreadsheetService] saveRow: 更新対象のtweetIdが見つからなかったため、新しい行として追加します。`);
        const rowValues = headers.map(header => rowObj[header] || '');
        this.sheet.appendRow(rowValues);
      }
    } catch (e) {
      Logger.log(`[SpreadsheetService] ★★★ saveRow中にエラーが発生: ${e.message}`);
    }
  }
}

module.exports = SpreadsheetService;
