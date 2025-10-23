/**
 * 侧边栏组件 - 参考 Stocknear 设计
 * 提供导航菜单、快速操作等功能
 */
import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  HomeOutlined,
  LineChartOutlined,
  SearchOutlined,
  CalendarOutlined,
  StarOutlined,
  FileTextOutlined,
  RobotOutlined,
  ToolOutlined,
  DollarOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from '@umijs/max';
import styles from './index.less';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate('/'),
    },
    {
      key: '/chat',
      icon: <RobotOutlined />,
      label: 'AI Stock Agent',
      onClick: () => navigate('/chat'),
    },
    {
      type: 'divider',
      key: 'divider-1',
    },
    {
      key: 'market',
      icon: <LineChartOutlined />,
      label: '行情',
      children: [
        {
          key: '/market/mover',
          label: '涨跌榜',
        },
        {
          key: '/market/calendar',
          label: '日历',
        },
      ],
    },
    {
      key: 'stocks',
      icon: <SearchOutlined />,
      label: '选股',
      children: [
        {
          key: '/screener',
          label: '股票筛选器',
        },
        {
          key: '/watchlist',
          label: '自选股',
        },
      ],
    },
    {
      key: 'analysis',
      icon: <ToolOutlined />,
      label: '分析工具',
      children: [
        {
          key: '/analysis',
          label: '财务分析',
        },
        {
          key: '/analyst',
          label: '分析师评级',
        },
      ],
    },
    {
      key: 'options',
      icon: <DollarOutlined />,
      label: '期权',
    },
    {
      key: 'news',
      icon: <FileTextOutlined />,
      label: '新闻',
    },
  ];

  const handleMenuClick = (e: any) => {
    const key = e.key;
    if (key === '/' || key === '/chat') {
      navigate(key);
    } else if (key === '/market/mover') {
      navigate(key);
    } else if (key === '/market/calendar') {
      navigate(key);
    } else if (key === '/screener') {
      navigate(key);
    } else if (key === '/watchlist') {
      navigate(key);
    } else if (key === '/analysis') {
      navigate(key);
    } else if (key === '/analyst') {
      navigate(key);
    } else if (key === '/options') {
      navigate(key);
    } else if (key === 'news') {
      navigate('/community/news-flow');
    }
    setDrawerOpen(false);
  };

  const menuContent = (
    <div className={styles.sidebarContent}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" className={styles.logoImg} />
          {!collapsed && <span className={styles.logoText}>cn股市</span>}
        </div>
      </div>

      {/* 快速操作按钮 */}
      {!collapsed && (
        <div className={styles.quickActions}>
          <Button
            type="primary"
            block
            icon={<RobotOutlined />}
            onClick={() => {
              navigate('/chat');
              setDrawerOpen(false);
            }}
            className={styles.aiButton}
          >
            开始AI对话
          </Button>
        </div>
      )}

      {/* 导航菜单 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems as any}
        onClick={handleMenuClick}
        className={styles.menu}
      />
    </div>
  );

  return (
    <>
      <div className={styles.sidebar} style={{ width: collapsed ? 60 : 250 }}>
        {!collapsed ? menuContent : (
          <div className={styles.collapsedSidebarContent}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              className={styles.menuButton}
              title="菜单"
            />
          </div>
        )}
      </div>

      {/* 移动端抽屉 */}
      <Drawer
        title="导航菜单"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        {menuContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
