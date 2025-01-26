const fs = require('fs').promises;

async function readFile(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

async function writeFile(filePath, content) {
  return await fs.writeFile(filePath, content, 'utf-8');
}

module.exports = {
  readFile,
  writeFile
};
