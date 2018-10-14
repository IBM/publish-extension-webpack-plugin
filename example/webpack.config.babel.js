import {resolve} from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import PublishExtensionPlugin from '../src';
import config from '../webpack.config.babel';
import dotenv from 'dotenv-safe';

dotenv.config({
  path: resolve(__dirname, '.env'),
  example: resolve(__dirname, '.env.example'),
});

export default {
  ...config,
  mode: 'development',
  entry: {
    example: resolve(__dirname),
  },
  output: {
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin([resolve(__dirname, 'manifest.json')]),
    new PublishExtensionPlugin({keepBundleOnSuccess: true}),
  ],
};
