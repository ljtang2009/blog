import webpackBaseConfig from '@build/webpack/webpack.config.base';
import {
  Configuration,
} from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config: Configuration = merge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/[name].css',
    }),
  ],
  stats: {
    preset: 'minimal',
    timings: false,
  },
});

export default config;
