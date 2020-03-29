const path = require('path');
const webpack = require('webpack');
// const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
// const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
// var dotenv = require('dotenv').config({ path: __dirname + '.env' });
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// var nodeModules = {}
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod
//   })

module.exports = {
  target: 'node',
  devtool: 'sourcemap',
  entry: ['babel-polyfill', './src/server.ts'],
  context: process.cwd(), // to automatically find tsconfig.json
  externals: [nodeExternals()], // Need this to avoid error when // nodeModules,
  output: {
    path: path.resolve(__dirname, 'dist'), // '/Application/vnptbkn.express',
    filename: 'server.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: './src/public/', to: './public/' },
      { from: '.env', to: './' },
      { from: './statics/', to: './' },
    ]),
  ],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
    fs: 'empty',
  },
};
