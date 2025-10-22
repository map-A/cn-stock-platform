/**
 * 特色列表导航页
 */

import React from 'react';
import { Card, Row, Col, Typography, Badge } from 'antd';
import {
  DollarOutlined,
  LineChartOutlined,
  RocketOutlined,
  FundOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const { Title, Paragraph } = Typography;

interface ListCategory {
  key: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  lists: Array<{
    key: string;
    title: string;
    path: string;
    badge?: string;
  }>;
}

const ListsIndexPage: React.FC = () => {
  const categories: ListCategory[] = [
    {
      key: 'dividend',
      title: '分红专区',
      icon: <DollarOutlined />,
      description: '高分红、稳定分红、股息增长股票',
      color: '#52c41a',
      lists: [
        { key: 'monthly', title: '月度分红股', path: '/lists/dividend/monthly' },
        { key: 'high-yield', title: '高股息率', path: '/lists/dividend/high-yield', badge: 'Hot' },
        { key: 'growth', title: '股息增长', path: '/lists/dividend/growth' },
        { key: 'stable', title: '分红稳定', path: '/lists/dividend/stable' },
      ],
    },
    {
      key: 'options',
      title: '期权异动',
      icon: <LineChartOutlined />,
      description: '期权成交量、隐含波动率、Put/Call比率',
      color: '#1890ff',
      lists: [
        { key: 'call-volume', title: '看涨期权成交量', path: '/lists/options/call-volume' },
        { key: 'put-volume', title: '看跌期权成交量', path: '/lists/options/put-volume' },
        { key: 'high-iv', title: '高隐含波动率', path: '/lists/options/high-iv', badge: 'New' },
        { key: 'open-interest', title: '未平仓合约', path: '/lists/options/open-interest' },
        { key: 'put-call-ratio', title: 'Put/Call比率', path: '/lists/options/put-call-ratio' },
      ],
    },
    {
      key: 'theme',
      title: '主题概念',
      icon: <RocketOutlined />,
      description: '热门主题、行业概念、政策驱动',
      color: '#722ed1',
      lists: [
        { key: 'nev', title: '新能源汽车', path: '/lists/theme/nev', badge: 'Hot' },
        { key: 'semiconductor', title: '半导体芯片', path: '/lists/theme/semiconductor' },
        { key: 'ai', title: '人工智能', path: '/lists/theme/ai', badge: 'Hot' },
        { key: 'biopharm', title: '生物医药', path: '/lists/theme/biopharm' },
        { key: '5g', title: '5G通信', path: '/lists/theme/5g' },
        { key: 'new-infra', title: '新基建', path: '/lists/theme/new-infra' },
        { key: 'defense', title: '军工国防', path: '/lists/theme/defense' },
        { key: 'consumption', title: '消费升级', path: '/lists/theme/consumption' },
        { key: 'carbon-neutral', title: '碳中和', path: '/lists/theme/carbon-neutral' },
        { key: 'metaverse', title: '元宇宙', path: '/lists/theme/metaverse' },
      ],
    },
    {
      key: 'technical',
      title: '技术信号',
      icon: <ThunderboltOutlined />,
      description: '突破新高、涨跌停、放量异动',
      color: '#fa8c16',
      lists: [
        { key: 'new-high', title: '突破新高', path: '/lists/technical/new-high', badge: 'Hot' },
        { key: 'up-limit', title: '连续涨停', path: '/lists/technical/up-limit' },
        { key: 'down-limit', title: '连续跌停', path: '/lists/technical/down-limit' },
        { key: 'high-volume-up', title: '放量上涨', path: '/lists/technical/high-volume-up' },
        { key: 'low-volume-down', title: '缩量下跌', path: '/lists/technical/low-volume-down' },
      ],
    },
    {
      key: 'fundamental',
      title: '基本面',
      icon: <BarChartOutlined />,
      description: '低估值、高成长、优质财务',
      color: '#eb2f96',
      lists: [
        { key: 'low-pe', title: '低市盈率', path: '/lists/fundamental/low-pe' },
        { key: 'low-pb', title: '低市净率', path: '/lists/fundamental/low-pb' },
        { key: 'high-roe', title: '高ROE', path: '/lists/fundamental/high-roe', badge: 'Hot' },
        { key: 'profit-growth', title: '高利润增长', path: '/lists/fundamental/profit-growth' },
        { key: 'revenue-growth', title: '高营收增长', path: '/lists/fundamental/revenue-growth' },
        { key: 'low-debt', title: '低负债率', path: '/lists/fundamental/low-debt' },
      ],
    },
  ];

  /**
   * 渲染分类卡片
   */
  const renderCategoryCard = (category: ListCategory) => (
    <Card
      key={category.key}
      className={styles.categoryCard}
      hoverable
      bordered={false}
      bodyStyle={{ padding: 24 }}
    >
      <div className={styles.categoryHeader}>
        <div
          className={styles.categoryIcon}
          style={{ background: `${category.color}20`, color: category.color }}
        >
          {category.icon}
        </div>
        <div className={styles.categoryInfo}>
          <Title level={4} style={{ marginBottom: 4 }}>
            {category.title}
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 13 }}>
            {category.description}
          </Paragraph>
        </div>
      </div>

      <div className={styles.listLinks}>
        {category.lists.map((list) => (
          <div
            key={list.key}
            className={styles.listLink}
            onClick={() => history.push(list.path)}
          >
            <span>{list.title}</span>
            {list.badge && (
              <Badge
                count={list.badge}
                style={{
                  background: list.badge === 'Hot' ? '#f5222d' : '#52c41a',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <PageContainer
      header={{
        title: '特色列表',
        subTitle: '30+ 专业股票榜单，多维度发现投资机会',
      }}
    >
      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col key={category.key} xs={24} sm={24} md={12} lg={8} xl={8}>
            {renderCategoryCard(category)}
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default ListsIndexPage;
