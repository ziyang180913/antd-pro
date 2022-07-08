import { defineConfig } from '@umijs/max';
import routes from '../src/routes';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  request: {},
  initialState: {},
  model: {},
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  headScripts: [
    // 百度地图 script
    {
      src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=7Cc5Kmn672miPzG4qQhvlOrERcXMMinq',
      type: 'text/javascript',
    },
  ],
  targets: {
    ie: 11,
  },
  routes,
  theme: {
    'root-entry-name': 'variable',
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: true,
  presets: ['umi-presets-pro'],
});
