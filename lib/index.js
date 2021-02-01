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
  return compiler;
}

module.exports = webpack;
