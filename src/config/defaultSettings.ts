import type { ProLayoutProps } from '@ant-design/pro-components';

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  colorPrimary: '#00FC50',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  token: {
    bgLayout: '#09090B',
    sider: {
      colorMenuBackground: '#09090B',
      colorTextMenu: '#E5E7EB',
      colorTextMenuSelected: '#00FC50',
      colorBgMenuItemSelected: '#1A1D23',
    },
  },
};

export default Settings;
