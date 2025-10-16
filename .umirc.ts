import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'pnpm',
  
  // 基础配置
  title: '中国A股分析平台',
  
  // 只启用必要的插件
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/locale',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/initial-state',
  ],
  mfsu: false,
  
  // 解决 esbuild helpers 冲突
  esbuildMinifyIIFE: true,
  
  // Ant Design 配置
  antd: {
    dark: false,
    compact: false,
  },
  
  // 国际化配置
  locale: {
    default: 'zh-CN',
    antd: true,
    baseSeparator: '-',
  },
  
  // 路由配置 - 使用约定式路由
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//, /\/services\//],
  },
});
