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
2. 使用配置项创建`Compilver`实例
3. 执行插件的`apply`方法
4. 根据入口文件进行生成模块`modules`(单入口和多入口)，多入口可以为`modules`添加`name`属性来区分它是属于哪个入口文件
5. 利用入口模块、以及所有的模块，生成`chunks`
6. 遍历`chunks`，通过`chunk`来生成`assets`。`assets`的`key`为打包生成资源的文件名，`value`为打包生成资源的源代码
7. 遍历`assets`，将其`value`写入到`output`配置中定义的目录中

生成模块的详细步骤：

1. 生成模块
2. 通过`fs.readFile`读取模块源代码
3. 通过`loader`来处理源代码
4. 利用`@babel/parser`将源代码解析为`ast`
5. 通过`@babel/traverse`遍历`ast`，找到模块中的`require`语句，`require`语句引入的内容就是该模块的依赖
6. 将`require`中的所有路径都替换为相对于项目根目录的相对路径(`path.relative`)
7. 继续处理该模块的依赖模块

### 问题

* 如何在相对路径之前加`./`? 例：`src/title.js` -> `./src/title.js`
