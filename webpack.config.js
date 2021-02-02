const path = require('path');
const RunPlugin = require('./plugins/run-plugin');
const DonePlugin = require('./plugins/done-plugin');
module.exports = {
  entry: 'src/index.js',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders', 'logger1-loader'),
          path.resolve(__dirname, 'loaders', 'logger2-loader')
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin()
  ]
};
