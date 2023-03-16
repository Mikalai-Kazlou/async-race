const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: 'localhost',
    hot: false,
  },
};
