const fsPromises = require("fs").promises;

const readFile = (path) => {
  return fsPromises.readFile(path, 'utf-8').then((data) => JSON.parse(data))
};

module.exports = readFile;