const { SyncHook } = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('@babel/types');
const parser = require('@babel/parser');
const { absoluteToRoot } = require('./utils');
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
      const absPath = absoluteToRoot(entries[name]);
      const entryModule = this.buildModule(name, absPath);
      this.entries.push(entryModule);
    }
  }

  buildModule (name, modulePath) {
    // id: path that relative to project root directory
    const id = relativeToRoot(modulePath);
    const module = { id, name, dependencies: [] };
    const source = fs.readFileSync(modulePath, 'utf-8');

    return module;
  }
}

module.exports = Compiler;
