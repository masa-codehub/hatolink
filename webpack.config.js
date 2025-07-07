// webpack.config.js
const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // ★この行を追加

module.exports = {
  mode: 'development',
  entry: './hatolink/infrastructure/triggers.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new GasPlugin(),
    // ★ここから追加
    new CopyPlugin({
      patterns: [
        {
          from: 'hatolink/appsscript.json', // コピー元のファイル
          to: '.' // 出力先(dist)のルートにコピー
        }
      ]
    })
    // ★ここまで追加
  ]
};