/**
 * 市场热图页面
 * 使用树图展示市场各板块、行业的表现
 */

import React, { useEffect, useState } from 'react';
import { Card, Space, Select, Button, Spin, message } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Treemap } from '@ant-design/plots';
import {
  getMarketHeatmap,
  getSectorHeatmap,
  getIndustryHeatmap,
  exportHeatmapData,
} from '@/services/industry';
import type { HeatmapData } from '@/services/industry';
import styles from './index.less';

const { Option } = Select;

/**
 * 市场热图页面组件
 */
const MarketHeatmap: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [heatmapType, setHeatmapType] = useState<'market' | 'sector' | 'industry'>('market');
  const [timeRange, setTimeRange] = useState<'1d' | '5d' | '1m' | '3m' | '6m' | '1y'>('1d');
  const [groupBy, setGroupBy] = useState<'sector' | 'industry' | 'marketCap'>('sector');

  /**
   * 加载热图数据
   */
  const loadHeatmapData = async () => {
    setLoading(true);
    try {
      let data: HeatmapData;

      switch (heatmapType) {
        case 'market':
          data = await getMarketHeatmap(timeRange, groupBy, 100);
          break;
        case 'sector':
          data = await getSectorHeatmap(timeRange);
          break;
        case 'industry':
          data = await getIndustryHeatmap(timeRange);
          break;
        default:
          data = await getMarketHeatmap(timeRange, groupBy, 100);
      }

      setHeatmapData(data);
    } catch (error) {
      message.error('加载热图数据失败');
      console.error('Failed to load heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmapData();
  }, [heatmapType, timeRange, groupBy]);

  /**
   * 导出热图数据
   */
  const handleExport = async (format: 'csv' | 'excel') => {
    if (!heatmapData) return;

    try {
      const blob = await exportHeatmapData(heatmapData.config, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `heatmap_${timeRange}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
      console.error('Failed to export heatmap:', error);
    }
  };

  /**
   * 转换数据为树图格式
   */
  const transformToTreemapData = () => {
    if (!heatmapData) return { name: 'root', children: [] };

    // 按分组整理数据
    const groupMap = new Map<string, any[]>();

    heatmapData.cells.forEach((cell) => {
      const group = cell.group || '其他';
      if (!groupMap.has(group)) {
        groupMap.set(group, []);
      }
      groupMap.get(group)!.push({
        name: cell.name,
        value: cell.value,
        changePercent: cell.changePercent,
      });
    });

    // 构建树形结构
    const children = Array.from(groupMap.entries()).map(([group, items]) => ({
      name: group,
      children: items,
    }));

    return {
      name: 'root',
      children,
    };
  };

  /**
   * 树图配置
   */
  const treemapConfig = {
    data: transformToTreemapData(),
    colorField: 'changePercent',
    color: [
      '#006400',
      '#32CD32',
      '#90EE90',
      '#D3D3D3',
      '#FFB6C1',
      '#DC143C',
      '#8B0000',
    ],
    legend: {
      position: 'bottom-left' as const,
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.name,
          value: `涨跌: ${datum.changePercent?.toFixed(2)}%`,
        };
      },
    },
    label: {
      style: {
        fontSize: 12,
        fill: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
      },
      formatter: (datum: any) => {
        return `${datum.name}\n${datum.changePercent?.toFixed(2)}%`;
      },
    },
    interactions: [
      {
        type: 'treemap-drill-down',
      },
    ],
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
  };

  /**
   * 渲染统计信息
   */
  const renderStats = () => {
    if (!heatmapData) return null;

    const { stats } = heatmapData;

    return (
      <Card size="small" className={styles.statsCard}>
        <Space split="|" size="large">
          <span>
            总数: <strong>{stats.totalCount}</strong>
          </span>
          <span>
            上涨: <strong style={{ color: '#cf1322' }}>{stats.gainersCount}</strong>
          </span>
          <span>
            下跌: <strong style={{ color: '#3f8600' }}>{stats.losersCount}</strong>
          </span>
          <span>
            平均涨跌:{' '}
            <strong
              style={{
                color: stats.avgChangePercent >= 0 ? '#cf1322' : '#3f8600',
              }}
            >
              {stats.avgChangePercent.toFixed(2)}%
            </strong>
          </span>
        </Space>
      </Card>
    );
  };

  return (
    <PageContainer
      title="市场热图"
      subTitle="实时展示市场各板块、行业、个股的涨跌情况"
      extra={[
        <Select
          key="type"
          value={heatmapType}
          onChange={setHeatmapType}
          style={{ width: 120 }}
        >
          <Option value="market">市场热图</Option>
          <Option value="sector">板块热图</Option>
          <Option value="industry">行业热图</Option>
        </Select>,
        <Select
          key="timeRange"
          value={timeRange}
          onChange={setTimeRange}
          style={{ width: 100 }}
        >
          <Option value="1d">今日</Option>
          <Option value="5d">5日</Option>
          <Option value="1m">1月</Option>
          <Option value="3m">3月</Option>
          <Option value="6m">6月</Option>
          <Option value="1y">1年</Option>
        </Select>,
        heatmapType === 'market' && (
          <Select
            key="groupBy"
            value={groupBy}
            onChange={setGroupBy}
            style={{ width: 120 }}
          >
            <Option value="sector">按板块</Option>
            <Option value="industry">按行业</Option>
            <Option value="marketCap">按市值</Option>
          </Select>
        ),
        <Button key="refresh" icon={<ReloadOutlined />} onClick={loadHeatmapData}>
          刷新
        </Button>,
        <Button
          key="export"
          icon={<DownloadOutlined />}
          onClick={() => handleExport('csv')}
        >
          导出
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {renderStats()}

        <Card style={{ marginTop: 16 }}>
          <div className={styles.heatmapContainer}>
            {heatmapData ? (
              <Treemap {...treemapConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>暂无数据</div>
            )}
          </div>
        </Card>

        <Card style={{ marginTop: 16 }} title="热图说明">
          <Space direction="vertical">
            <div>
              <strong>颜色说明：</strong>
              深红色表示大幅上涨，深绿色表示大幅下跌，灰色表示平盘
            </div>
            <div>
              <strong>大小说明：</strong>
              方块大小表示市值或成交额
            </div>
            <div>
              <strong>交互说明：</strong>
              点击方块可以下钻查看详细数据
            </div>
          </Space>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default MarketHeatmap;
