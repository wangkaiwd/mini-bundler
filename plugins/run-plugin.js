class RunPlugin {
  apply (compiler) {
    compiler.hooks.done.tap('RunPlugin', () => {
      console.log('Run~~~~~~');
    });
  }
}

module.exports = RunPlugin;
