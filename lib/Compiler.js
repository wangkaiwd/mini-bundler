const { SyncHook } = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('@babel/types');
const parser = require('@babel/parser');
const { rootDir } = require('./utils');
const { relativeToRoot } = require('./utils');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

class Compiler {
  constructor (options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook()
    };
    // 存放所有的模块
    // {id, name, dependencies}
    this.modules = [];
    this.entries = [];
    this.chunks = [];
    this.assets = {};
    this.files = [];
  }

  normalizeEntries () {
    const { entry } = this.options;
    let entries = {};
    if (typeof entry === 'string') { // 单入口
      entries['main.js'] = entry;
    } else { // 多入口
      entries = entry;
    }
    return entries;
  }

  run () {
    // 要根据入口文件来进行打包
    this.hooks.run.call();
    this.compile();
    // 开始编译
    this.hooks.done.call();
  }

  compile () {
    const entries = this.normalizeEntries();
    // {
    //    page1: './src/page1.js',
    //    page1: './src/page2.js'
    // }
    for (const name in entries) {
      // 入口文件的绝对路径
      const absPath = path.join(rootDir, entries[name]);
      const entryModule = this.buildModule(name, absPath);
      const modules = this.modules.filter(m => m.name === name);
      const chunk = { name, entryModule, modules };
      this.chunks.push(chunk);
      this.entries.push(entryModule);
    }
    this.outputFile();
  }

  getSource (chunk) {
    const modulesStr = chunk.modules.map(module => {
      return `'${module.id}': function (module, exports, require) {
          ${module.source}
        }`;
    }).join(',');
    return `
      (() => {
        const modules = {
          ${modulesStr}
        };
        const cache = {};
  
        function require (moduleId) {
          const cacheModule = cache[moduleId];
          if (cacheModule) {
            return cacheModule;
          }
          const module = cache[moduleId] = {
            exports: {}
          };
          modules[moduleId].call(module, module, module.exports, require);
          return module.exports;
        }
        (() => {
          ${chunk.entryModule.source}
        })()
      })()
    `;
  }

  outputFile () {
    const { output } = this.options;
    this.chunks.forEach(chunk => {
      this.assets[chunk.name] = this.getSource(chunk);
    });
    this.files = Object.keys(this.assets);
    for (const file in this.assets) {
      if (this.assets.hasOwnProperty(file)) {
        const reg = /\[.+]/g;
        let filename = output.filename;
        if (reg.test(filename)) {
          filename = filename.replace('[name]', file);
        }
        const outputName = path.join(output.path, filename);
        this.ensureDistExists();
        fs.writeFileSync(outputName, this.assets[file]);
      }
    }
  }

  ensureDistExists () {
    const { output } = this.options;
    if (!fs.existsSync(output.path)) {
      fs.mkdirSync(output.path);
    }
  }

  buildModule (name, modulePath) {
    // id: path that relative to project root directory
    const id = relativeToRoot(modulePath);
    const module = { id, name, dependencies: [] };
    let source = fs.readFileSync(modulePath, 'utf-8');
    source = this.handleRules(modulePath, source);
    // 1. 通过ast修改require引入路径 2. 收集模块的require引入的依赖模块
    this.collectDepModules(module, source);
    this.buildDepModule(module);
    return module;
  }

  collectDepModules (module, source) {
    const { context } = this.options;
    const ast = parser.parse(source, { sourceType: 'module' });
    traverse(ast, {
      // https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#paths
      CallExpression ({ node }) {
        if (node.callee?.name === 'require') {
          const depModulePath = path.join(context, node.arguments[0].value);
          const depModuleId = relativeToRoot(depModulePath);
          module.dependencies.push(depModulePath);
          // 替换节点
          node.arguments = [types.stringLiteral(depModuleId)];
        }
      }
    });
    module.source = generator(ast).code;
  }

  buildDepModule (module) {
    module.dependencies.forEach(dep => {
      const depModule = this.buildModule(module.name, dep);
      this.modules.push(depModule);
    });
  }

  handleRules (modulePath, source) {
    const { rules } = this.options.module;
    rules.forEach(({ test, use }) => {
      if (test.test(modulePath)) {
        source = this.executeLoader(source, use);
      }
    });
    return source;
  }

  executeLoader (source, loaders) {
    for (let i = loaders.length - 1; i >= 0; i--) {
      const loader = require(loaders[i]);
      source = loader(source);
    }
    return source;
  }
}

module.exports = Compiler;
