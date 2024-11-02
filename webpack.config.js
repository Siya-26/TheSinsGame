const path = require('path');

module.exports = {
  entry: './javascript/level4/src/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './javascript/level4/dist'),
  },
};
