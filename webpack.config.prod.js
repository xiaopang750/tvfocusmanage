let webpack = require('webpack');

let rootDir = __dirname;

let webpackConfig = {
  output: {
    path: `${rootDir}/public`,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  entry: {
    index: [`${rootDir}/examples/normal/index.js`],
    index2: `${rootDir}/examples/scroll/index.js`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: `${rootDir}/node_modules`,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: `${rootDir}/examples`,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[ext]',
              limit: 1
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: `${rootDir}/examples`,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

module.exports = webpackConfig;
