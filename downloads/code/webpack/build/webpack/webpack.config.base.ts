import { Configuration, DefinePlugin } from 'webpack';
import path from 'node:path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import HtmlWebpackPlugin = require('html-webpack-plugin');
import { VueLoaderPlugin } from 'vue-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import AutoImport from 'unplugin-auto-import/webpack';
import Components from 'unplugin-vue-components/webpack';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

const config: Configuration = {
  context: path.resolve(process.cwd(), './src'),
  entry: {
    app: path.resolve(process.cwd(), './src/app.ts'),
  },
  output: {
    clean: true,
    filename: 'script/[name].[contenthash].js',
    path: path.resolve(process.cwd(), './dist-web'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.(less|css)$/,
        use: [
          'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name]_[contenthash].[ext]',
              limit: 1024 * 5,
              esModule: false,
            },
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue', '.json'],
    alias: {
      '@src': path.resolve(process.cwd(), './src'),
    },
  },
  optimization: {
    runtimeChunk: 'single',
    // splitChunks 用来拆分代码
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      // template: path.resolve(selfModulePath, './src/index.ejs'),
      template: path.resolve(process.cwd(), './src/index.html'),
      templateParameters: {
        title: 'loading',
        timestamp: new Date().getTime(),
      },
      inject: 'body',
      hash: true,
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV']),
      'process.env.STORAGE_ENCRYPT_KEY': JSON.stringify(process.env['STORAGE_ENCRYPT_KEY']),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), './public'),
          filter: async (resourcePath: string) => {
            const pattern = /(.gitkeep)/;
            return !pattern.test(resourcePath);
          },
        },
      ],
    }),
    AutoImport({
      imports: [
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      // 允许子目录作为组件的命名空间前缀。 防止组件命名冲突
      directoryAsNamespace: true,
    }),
  ],
  performance: {
    maxAssetSize: 1024 * 800, // 单位 bytes
    maxEntrypointSize: 1024 * 1024,
  },
};

export default config;
