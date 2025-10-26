import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import React from 'react';
import {
  AvatarDropdown,
  AvatarName,
  Question,
  SelectLang,
} from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '@/config/defaultSettings';
import { getLayoutSettings } from '@/config/themeToken';
import { errorConfig } from '@/requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';
// 导入 API 拦截器，确保在应用启动时被初始化
import '@/api/interceptors';
// 导入全局主题样式变量
import '@/styles/theme-variables.css';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };
  
  // 应用动态主题token到默认设置
  const initialSettings = getLayoutSettings(defaultSettings as Partial<LayoutSettings>);
  
  // 初始化时设置CSS变量到:root
  if (initialSettings.token) {
    const root = document.documentElement;
    Object.entries(initialSettings.token).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // 将驼峰命名转换为kebab-case
        const cssVarName = `--ant-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
      }
    });
  }
  
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: initialSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: initialSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => null, // Footer 未定义
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              // 应用动态主题token
              const updatedSettings = getLayoutSettings(settings);
              
              // 动态更新CSS变量到:root
              if (updatedSettings.token) {
                const root = document.documentElement;
                Object.entries(updatedSettings.token).forEach(([key, value]) => {
                  if (typeof value === 'string') {
                    // 将驼峰命名转换为kebab-case
                    const cssVarName = `--ant-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                    root.style.setProperty(cssVarName, value);
                  }
                });
              }
              
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings: updatedSettings,
              }));
            }}
          />
        </>
      );
    },
    // 应用动态主题token到当前settings
    ...(initialState?.settings || {}),
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: isDev ? '' : 'https://proapi.azurewebsites.net',
  ...errorConfig,
};

/**
 * @name Ant Design 运行时配置
 * @description 配置运行时的主题，确保首次加载时主题正确
 * @doc https://umijs.org/docs/max/antd#运行时配置
 */
export const antd = (memo: any) => {
  // 获取初始化的主题设置
  const initialSettings = getLayoutSettings(defaultSettings as Partial<LayoutSettings>);
  const token = initialSettings.token || {};

  return {
    ...memo,
    theme: {
      cssVar: {
        prefix: '--ant',
      },
      token: {
        fontFamily: 'AlibabaSans, sans-serif',
        // 应用初始主题token
        ...token,
      },
    },
  };
};
