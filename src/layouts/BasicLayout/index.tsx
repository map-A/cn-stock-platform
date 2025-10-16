/**
 * 基础布局组件
 */
import React, { useState } from 'react';
import { ProLayout } from '@ant-design/pro-layout';
import { Link, Outlet, useModel, history } from '@umijs/max';
import { Avatar, Dropdown, Space, Badge, MenuProps } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import SearchBar from '@/components/SearchBar';
import { useUserStore } from '@/models/user';
import styles from './index.less';

const BasicLayout: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { user, logout } = useUserStore();
  const [pathname, setPathname] = useState(location.pathname);

  // 用户菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => history.push('/user/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
      onClick: () => history.push('/user/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        history.push('/user/login');
      },
    },
  ];

  // 右侧内容
  const rightContentRender = () => (
    <Space size="large" className={styles.rightContent}>
      {/* 搜索栏 */}
      <SearchBar />

      {/* 通知 */}
      <Badge count={user?.isPro ? 5 : 0} size="small">
        <BellOutlined
          style={{ fontSize: 18, cursor: 'pointer' }}
          onClick={() => history.push('/notifications')}
        />
      </Badge>

      {/* 用户信息 */}
      {user ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className={styles.userInfo}>
            <Avatar icon={<UserOutlined />} src={user.avatar} />
            <span>{user.username}</span>
            {user.isPro && (
              <span className={styles.proBadge}>PRO</span>
            )}
          </Space>
        </Dropdown>
      ) : (
        <Link to="/user/login">登录</Link>
      )}
    </Space>
  );

  return (
    <ProLayout
      title="中国股市分析平台"
      logo="/logo.png"
      layout="mix"
      navTheme="light"
      contentWidth="Fluid"
      fixSiderbar
      fixedHeader
      location={{ pathname }}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(item, dom) => (
        <Link
          to={item.path || '/'}
          onClick={() => setPathname(item.path || '/')}
        >
          {dom}
        </Link>
      )}
      rightContentRender={rightContentRender}
      footerRender={() => (
        <div className={styles.footer}>
          <div>中国股市分析平台 ©2024 Created by Team</div>
          <div>
            <a href="/about">关于我们</a>
            <a href="/privacy">隐私政策</a>
            <a href="/terms">服务条款</a>
          </div>
        </div>
      )}
    >
      <Outlet />
    </ProLayout>
  );
};

export default BasicLayout;
