## mini-bundler

make a mini JavaScript code bundler

### tools

* [@babel/parser](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-parser)
* [@babel/traverse](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-babel-traverse)
* [@babel/generator](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-generator)
* [@babel/types](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-babel-types)

### 思路

使用

```javascript
const webpack = require('./lib')
const options = require('./webpack.config.js')
const compiler = webpack(options)

compiler.run()
```
