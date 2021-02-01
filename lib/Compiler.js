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
    this.hooks.run.call();
    // 开始编译
    this.hooks.done.call();
  }
}

module.exports = Compiler;
