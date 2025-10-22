import React from 'react';
import { Space, Avatar, Dropdown } from 'antd';
import { UserOutlined, GlobalOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useModel, history, SelectLang } from '@umijs/max';
import { logout } from '@/services/user';
import DevStorage from '@/utils/devStorage';
import { flushSync } from 'react-dom';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';

const SiderFooter: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const loginOut = async () => {
    await logout();
    DevStorage.clearLoginState();
    
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');
    
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      loginOut();
      return;
    }
    if (key === 'center') {
      history.push('/account/center');
    } else if (key === 'settings') {
      history.push('/account/settings');
    }
  };

  const menuItems = currentUser
    ? [
        {
          key: 'center',
          icon: <UserOutlined />,
          label: '个人中心',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '个人设置',
        },
        {
          type: 'divider' as const,
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: '退出登录',
        },
      ]
    : [
        {
          key: 'login',
          icon: <UserOutlined />,
          label: '登录',
          onClick: () => history.push('/user/login'),
        },
      ];

  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #e8e8e8',
        background: '#fff',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Space size="middle" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 用户信息 */}
        {currentUser ? (
          <Dropdown
            menu={{
              selectedKeys: [],
              onClick: onMenuClick,
              items: menuItems,
            }}
            placement="topLeft"
          >
            <Space 
              style={{ 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.3s',
              }}
              className="user-info-hover"
            >
              <Avatar size="small" src={currentUser.avatar} icon={<UserOutlined />} />
              <span style={{ fontSize: '14px', color: '#262626', fontWeight: 500 }}>
                {currentUser.name}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Space
            style={{ 
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.3s',
              backgroundColor: '#f0f0f0',
            }}
            onClick={() => history.push('/user/login')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
              const span = e.currentTarget.querySelector('span');
              if (span) (span as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              const span = e.currentTarget.querySelector('span');
              if (span) (span as HTMLElement).style.color = '#262626';
            }}
          >
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <span style={{ fontSize: '14px', color: '#262626', fontWeight: 500 }}>未登录</span>
          </Space>
        )}

        {/* 语言切换 */}
        <SelectLang />
      </Space>
    </div>
  );
};

export default SiderFooter;
