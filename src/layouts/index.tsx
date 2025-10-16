import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'umi';
import { HomeOutlined, StockOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginRight: 48 
          }}>
            <StockOutlined /> 中国A股分析平台
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={[
              {
                key: 'home',
                icon: <HomeOutlined />,
                label: <Link to="/">首页</Link>,
              },
            ]}
          />
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        中国A股分析平台 ©{new Date().getFullYear()} Created with ❤️
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
