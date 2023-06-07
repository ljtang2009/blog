process.env['NODE_ENV'] = 'development'
import { env } from '@ljtang2009/my-admin-common'
env.initEnv()
import getPort from 'get-port';
import config from '@build/webpack/webpack.config.dev';
import { webpack } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const runServer = async () => {

  const apiServerUrl = process.env['API_MOCK_SERVER_URL'];

  const devServerOptions: WebpackDevServer.Configuration = {
    client: {
      logging: 'info',
      overlay: true, // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
    },
    hot: true, // 启用 webpack 的 热模块替换 特性
    open: true,
    port: await getPort({
      port: parseInt(process.env['WEBSITE_DEV_SERVER_PORT']!, 10),
    }),
    proxy: {
      '/api': apiServerUrl!,
    },
  }

  const compiler = webpack(config);
  const server = new WebpackDevServer(devServerOptions, compiler);
  await server.start();
}

runServer();
