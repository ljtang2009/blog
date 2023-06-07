import webpackBaseConfig from '@build/webpack/webpack.config.base';
import { ProgressPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import dayjs from 'dayjs';
import packageJSON from '../../package.json';

async function getConfig() {
  const now = dayjs()
  const analyzerDirPath = path.resolve(process.cwd(), `./.build-report/${now.format('YYYY-MM-DD HH_mm_ss')}`);
  const analyzerFilePath = path.resolve(analyzerDirPath, './report.html');
  return merge(webpackBaseConfig, {
    mode: 'production',
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: analyzerFilePath,
        reportTitle: `${packageJSON.name} ${now.format('YYYY-MM-DD HH:mm:ss')}`,
        openAnalyzer: process.env['SHOW_ANALYZER'] === 'Y',
      }),
      new ProgressPlugin(),
      new ESLintPlugin({
        extensions: ['vue', 'js', 'jsx', 'cjs', 'mjs', 'ts', 'tsx', 'cts', 'mts'],
      }),
      new StylelintPlugin({
        extensions: ['css', 'less', 'scss', 'sass'],
      }),
      new MiniCssExtractPlugin({
        filename: 'style/[name].[contenthash].css',
      }),
    ],
    optimization: {
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
  });
}

export default getConfig;
