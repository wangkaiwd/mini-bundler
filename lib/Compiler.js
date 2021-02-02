const { SyncHook } = require('tapable');

class Compiler {
  constructor (options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook()
    };
  }

  run () {
    // 要根据入口文件来进行打包
    const { entry } = this.options;
    this.hooks.run.call();
    // 开始编译
    this.hooks.done.call();
  }

  buildModule () {

  }
}

module.exports = Compiler;
