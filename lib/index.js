const Compiler = require('./Compiler');

function resolveCmdArg () {
  const argv = process.argv.slice(2);
  // [--env=xxx,--mode=xxx]
  return argv.reduce((options, arg) => {
    const { key, val } = arg.split('=');
    options[key.slice(2)] = val;
    return options;
  }, {});
}

function webpack (options) {
  const cmdOptions = resolveCmdArg();
  Object.assign(options, cmdOptions);
  const compiler = new Compiler(options);
  const { plugins } = options;
  // 创建编译器实例后，立马执行plugin的apply方法
  plugins.forEach(p => p.apply(compiler));
  return compiler;
}

module.exports = webpack;
