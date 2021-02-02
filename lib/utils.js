const path = require('path');
const rootDir = process.cwd();
const relativeToRoot = (filePath) => {
  return path.relative(rootDir, filePath);
};
module.exports = {
  rootDir,
  relativeToRoot,
};
