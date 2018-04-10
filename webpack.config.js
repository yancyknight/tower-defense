var webpack = require('webpack');

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: "./game/scripts/game.js",
  output: {
    path: __dirname + "/server/public",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  }
};