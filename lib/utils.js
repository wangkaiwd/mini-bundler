const rootDir = process.cwd();
const path = require('path')
const relativeToRoot = (filePath) => {
  return path.relative(rootDir, filePath);
};
const absoluteToRoot = (filePath) => {
  return path.join(rootDir, filePath);
};

module.exports = {
  rootDir,
  relativeToRoot,
  absoluteToRoot
}
