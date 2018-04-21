var webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: "./game/scripts/init.js",
  output: {
    path: __dirname + "/server/public",
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    contentBase: [path.join(__dirname, "game"),path.join(__dirname, "server/images"),path.join(__dirname, "server/audio")],
    compress: true,
    port: 3000
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
              }
          }]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      }
    ]
  }
};
