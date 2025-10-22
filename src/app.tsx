/**
 * Umi 运行时配置 - 参考 stock-front
 */
import { requestConfig } from '@/request';
import '@/global.less';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import React from 'react';
import DevStorage from '@/utils/devStorage';
import { getCurrentUser } from '@/services/user';
import { Question } from '@/components/RightContent';
import SiderFooter from '@/components/SiderFooter';

const loginPath = '/user/login';
const isDev = process.env.NODE_ENV === 'development';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // 开发环境下，优先尝试从缓存恢复用户信息
      if (isDev) {
        const { token, userInfo } = DevStorage.getLoginState();
        
        if (token && userInfo) {
          console.log('🔄 开发环境恢复用户登录状态');
          return {
            name: userInfo.display_name || userInfo.username,
            avatar: userInfo.avatar_url || userInfo.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            userid: userInfo.user_id || userInfo.id,
            email: userInfo.email,
            signature: userInfo.role_name || '用户',
            title: userInfo.role_name || '用户',
            group: '股票交易系统',
            access: userInfo.role || 'user',
          };
        }
      }
      
      // 正常情况下从API获取用户信息
      const userInfo = await getCurrentUser();
      return {
        name: userInfo.displayName || userInfo.username,
        avatar: userInfo.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: userInfo.id,
        email: userInfo.email,
        signature: '用户',
        title: '用户',
        group: '股票交易系统',
        access: 'user',
      };
    } catch (error) {
      // 只有在没有有效token的情况下才跳转到登录页
      if (!DevStorage.hasValidLoginState()) {
        history.push(loginPath);
      }
    }
    return undefined;
  };

  // 如果不是登录页面和首页，执行获取用户信息
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// 请求配置
export const request = requestConfig;

/**
 * ProLayout 运行时配置
 * @see https://procomponents.ant.design/components/layout
 */
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // 右上角操作区域 - 只保留帮助图标
    actionsRender: () => [
      <Question key="doc" />,
    ],

    // 不显示顶部用户头像
    avatarProps: undefined,

    // 水印配置（可选）
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },

    // 底部区域
    footerRender: () => (
      <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '16px 0' }}>
        CN Stock Platform © 2024
      </div>
    ),

    // 侧边栏菜单配置
    menu: {
      locale: true, // 启用国际化
    },

    // 菜单头部渲染
    menuHeaderRender: undefined,

    // 侧边栏底部渲染 - 用户登录和语言切换
    menuFooterRender: () => <SiderFooter />,

    // 子页面渲染
    childrenRender: (children) => {
      return <>{children}</>;
    },

    // 应用初始配置
    ...initialState?.settings,
  };
};

export default {};
