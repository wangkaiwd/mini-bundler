const webpack = require('./lib');
const options = require('./webpack.config');
const compiler = webpack(options);
compiler.run();
