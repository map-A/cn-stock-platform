/**
 * 资产配置饼图组件
 */
import React from 'react';
import { Card, Empty, Row, Col, Statistic } from 'antd';
import { Pie } from '@ant-design/plots';
import type { AccountAssetAllocation } from '@/services/account';

interface AssetAllocationChartProps {
  allocations: AccountAssetAllocation[];
  loading?: boolean;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ allocations, loading }) => {
  if (!allocations || allocations.length === 0) {
    return (
      <Card loading={loading}>
        <Empty description="暂无资产配置数据" />
      </Card>
    );
  }

  // 准备图表数据
  const chartData = allocations.map((item) => ({
    category: item.category,
    value: Number(item.amount),
    percentage: Number(item.percentage),
  }));

  const pieConfig = {
    data: chartData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
      style: {
        fontSize: 12,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 24,
        },
        content: '资产\n配置',
      },
    },
    legend: {
      position: 'bottom' as const,
      offsetY: -10,
    },
  };

  // 计算总资产
  const totalAssets = allocations.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Card
      title="资产配置分析"
      loading={loading}
      extra={
        <Statistic
          title="总资产"
          value={totalAssets}
          precision={2}
          suffix="元"
          valueStyle={{ fontSize: 16 }}
        />
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <div style={{ height: 400 }}>
            <Pie {...pieConfig} />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div style={{ paddingTop: 20 }}>
            {allocations.map((item, index) => (
              <Row
                key={index}
                style={{
                  marginBottom: 16,
                  padding: '12px 16px',
                  background: '#fafafa',
                  borderRadius: 4,
                }}
              >
                <Col span={12}>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>{item.category}</div>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, color: '#1890ff' }}>
                    {Number(item.percentage).toFixed(2)}%
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    ¥{Number(item.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default AssetAllocationChart;
