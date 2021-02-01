class DonePlugin {
  apply (compiler) {
    compiler.hooks.run.tap('DonePlugin', () => {
      console.log('DONE~~~~~~~~');
    });
  }
}

module.exports = DonePlugin;
