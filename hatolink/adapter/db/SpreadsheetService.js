// SpreadsheetService.js
// GASのSpreadsheetAppをラップするサービス

class SpreadsheetService {
  constructor(sheetName = 'Queue') {
    if (typeof SpreadsheetApp !== 'undefined') {
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    } else {
      this.sheet = null; // テスト用
    }
  }

  async getRows() {
    if (!this.sheet) return [];
    const data = this.sheet.getDataRange().getValues();
    // 1行目はヘッダー想定
    return data.slice(1).map(row => ({
      status: row[0],
      body: row[1],
      // 必要に応じて他のカラムも追加
    }));
  }

  async saveRow(rowObj) {
    if (!this.sheet) return;
    // 例: body, status順で保存
    this.sheet.appendRow([rowObj.status, rowObj.body]);
  }
}

module.exports = SpreadsheetService;
