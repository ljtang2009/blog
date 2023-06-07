process.env['NODE_ENV'] = 'production';
import { env } from '@ljtang2009/my-admin-common';
env.initEnv();
import getConfig from '@build/webpack/webpack.config.prod';
import webpack from 'webpack';

export async function build() {
  const webpackConfig = await getConfig();
  const stats = await runWebpack(webpackConfig);
  if (stats) {
    // eslint-disable-next-line no-console
    console.info(
      stats.toString({
        colors: true,
        modules: false,
        entrypoints: false,
      }),
    );
  }
  return {
    webpackConfig,
    stats,
  };
}

function runWebpack(webpackConfig: Record<string, any>) {
  return new Promise<webpack.Stats | undefined>((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

build();
