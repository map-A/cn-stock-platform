import React, { Suspense, lazy } from 'react';
import { Tabs, Spin } from 'antd';
import { useLocation, useNavigate, useIntl } from '@umijs/max';

interface TabRoute {
  path: string;
  name: string;
  component?: string;
}

interface TabLayoutProps {
  routes: TabRoute[];
  basePath: string;
  children?: React.ReactNode;
}

const TabLayout: React.FC<TabLayoutProps> = ({ routes, basePath, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  // 获取当前激活的标签页
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const route = routes.find(route => currentPath === route.path);
    return route?.path || routes[0]?.path;
  };

  // 处理标签页切换
  const handleTabChange = (activeKey: string) => {
    navigate(activeKey);
  };

  // 生成标签页配置
  const tabItems = routes.map(route => ({
    key: route.path,
    label: intl.formatMessage({ id: route.name }),
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Tabs
        activeKey={getActiveTab()}
        onChange={handleTabChange}
        items={tabItems}
        style={{ marginBottom: '24px' }}
        size="large"
        type="card"
      />
      <div style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Suspense fallback={<Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: '50px' }} />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default TabLayout;