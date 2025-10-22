import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * ProLayout 默认配置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  colorPrimary: '#00FC50',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'CN Stock Platform',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  token: {
    // 通过 token 修改样式
    // https://procomponents.ant.design/components/layout#通过-token-修改样式
    bgLayout: '#09090B',
    sider: {
      colorBgMenuItemSelected: '#1a1a1a',
      colorTextMenuSelected: '#00FC50',
      colorTextMenu: '#E5E7EB',
      colorBgMenuItemHover: '#141414',
    },
  },
  siderWidth: 240,
};

export default Settings;
