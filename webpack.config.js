const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /png$/,
        use: [
          {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'public',
          }
        }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api/**': {
        target: 'http://localhost:80',
        // pathRewrite: { '^/api': '' },
        secure: false,
        logLevel: 'debug'
      },
      '/user/**': {
        target: 'http://localhost:80',
        // pathRewrite: { '^/auth': '' },
        secure: false,
        logLevel: 'debug'
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(outputDirectory, '*.*'), 
      path.join(outputDirectory, 'public', '*.*')
    ], {
      verbose: true
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
