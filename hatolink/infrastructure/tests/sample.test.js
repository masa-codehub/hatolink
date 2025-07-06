// シンプルなApps Script用テスト関数（自作）
function testSample() {
  var result = 1 + 1;
  if (result !== 2) {
    throw new Error('Test failed: 1 + 1 should equal 2');
  }
  Logger.log('Test passed: 1 + 1 = 2');
}
