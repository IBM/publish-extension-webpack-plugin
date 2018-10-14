import {resolve} from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import pkg from './package';

export default {
  mode: 'production',
  target: 'node',
  entry: {
    [pkg.name]: resolve(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    libraryTarget: 'umd',
  },
  plugins: [
    new CleanWebpackPlugin(resolve(__dirname, 'dist')),
  ],
};
