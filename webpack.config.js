const path = require('path');
const RunPlugin = require('./plugins/run-plugin');
const DonePlugin = require('./plugins/done-plugin');
module.exports = {
  // entry: 'src/index.js',
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js'
  },
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
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
