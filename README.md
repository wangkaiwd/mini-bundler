## mini-bundler

Make a mini JavaScript code bundler

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

1. 合并命令行参数和配置文件中的配置项，命令行参数优先
2. 使用配置项创建`Compiler`实例
3. 执行插件的`apply`方法
