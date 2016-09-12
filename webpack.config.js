var path = require("path");
var webpack = require("webpack");
var fs = require("fs");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var DEBUG = !process.argv.includes('--release');

var srcPath = path.join(__dirname, "./src");
var destPath = path.join(__dirname, "./lib");
var nodeModulesPath = path.join(__dirname, "./node_modules");

var GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG
};

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports =  {
  name: 'browser',
  entry: srcPath + '/controller.js',
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: destPath,
  },
  module: {
    loaders: [
        // All files with a '.js' or '.jsx' extension will be handled by 'babel-loader'.
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          query: {
            presets: ['es2015']
          }
        },
    ],
  },

  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
      new ExtractTextPlugin("[name].js"),
      new webpack.BannerPlugin('require("source-map-support").install();',
        { raw: true, entryOnly: false }),
  ],

  resolve: {
      extensions: ["", ".webpack.js", ".web.js", ".jsx", ".js", "css", "scss"]
  },

  devtool: 'source-map',
  externals: nodeModules
};
