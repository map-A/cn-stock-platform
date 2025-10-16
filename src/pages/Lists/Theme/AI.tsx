/**
 * 人工智能主题列表页
 */

import React, { useState } from 'react';
import { Card, message, Tabs, Tag, Space } from 'antd';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Column } from '@ant-design/plots';
import ListTable from '@/components/Lists/ListTable';
import listService, { ListType, type ListQueryParams } from '@/services/listService';
import { useWatchlistStore } from '@/stores/watchlist';
import styles from './AI.less';

const { Statistic } = StatisticCard;

const AIThemeListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [queryParams, setQueryParams] = useState<ListQueryParams>({
    type: ListType.AI_THEME,
    page: 1,
    pageSize: 50,
    sortBy: 'changePercent',
    sortOrder: 'descend',
  });

  const { watchlist, toggleWatchlist } = useWatchlistStore();

  // 获取列表数据
  const { data: listData, loading } = useRequest(
    () => listService.getList(queryParams),
    {
      refreshDeps: [queryParams],
    },
  );

  // 获取主题统计
  const { data: themeStats } = useRequest(
    () => listService.getListHistory(ListType.AI_THEME, 7),
    {
      cacheKey: 'ai-theme-stats',
    },
  );

  /**
   * 处理分页变化
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams((prev) => ({ ...prev, page, pageSize }));
  };

  /**
   * 处理排序
   */
  const handleSort = (field: string, order: 'ascend' | 'descend' | null) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: order || undefined,
    }));
  };

  /**
   * 导出数据
   */
  const handleExport = async () => {
    try {
      const blob = await listService.exportList(queryParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `人工智能主题_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  /**
   * 渲染主题概览
   */
  const renderOverview = () => {
    if (!listData?.data) return null;

    const upCount = listData.data.filter((item) => item.changePercent > 0).length;
    const downCount = listData.data.filter((item) => item.changePercent < 0).length;
    const avgChange =
      listData.data.reduce((sum, item) => sum + item.changePercent, 0) / listData.data.length;

    return (
      <ProCard split="vertical" ghost>
        <StatisticCard
          statistic={{
            title: '成分股总数',
            value: listData.data.length,
            suffix: '只',
          }}
        />
        <StatisticCard
          statistic={{
            title: '上涨股票',
            value: upCount,
            suffix: '只',
            valueStyle: { color: '#f5222d' },
          }}
        />
        <StatisticCard
          statistic={{
            title: '下跌股票',
            value: downCount,
            suffix: '只',
            valueStyle: { color: '#52c41a' },
          }}
        />
        <StatisticCard
          statistic={{
            title: '平均涨跌幅',
            value: avgChange.toFixed(2),
            suffix: '%',
            valueStyle: { color: avgChange >= 0 ? '#f5222d' : '#52c41a' },
          }}
        />
      </ProCard>
    );
  };

  /**
   * 渲染趋势图表
   */
  const renderTrendChart = () => {
    if (!themeStats) return null;

    const config = {
      data: themeStats,
      xField: 'date',
      yField: 'avgChange',
      columnStyle: {
        fill: (datum: any) => (datum.avgChange >= 0 ? '#f5222d' : '#52c41a'),
      },
      label: {
        position: 'top' as const,
        style: {
          fill: '#666',
          fontSize: 12,
        },
      },
    };

    return <Column {...config} />;
  };

  /**
   * 渲染主题标签
   */
  const renderThemeTags = () => {
    const tags = [
      { label: 'ChatGPT', color: '#1890ff' },
      { label: '大模型', color: '#722ed1' },
      { label: '算力', color: '#eb2f96' },
      { label: '芯片', color: '#fa8c16' },
      { label: '云计算', color: '#52c41a' },
      { label: '数据中心', color: '#13c2c2' },
    ];

    return (
      <Space wrap>
        {tags.map((tag) => (
          <Tag key={tag.label} color={tag.color}>
            {tag.label}
          </Tag>
        ))}
      </Space>
    );
  };

  return (
    <PageContainer
      header={{
        title: '人工智能主题',
        subTitle: 'AI、大模型、算力相关概念股',
        tags: renderThemeTags(),
      }}
    >
      {/* 主题概览 */}
      <div style={{ marginBottom: 16 }}>{renderOverview()}</div>

      {/* 标签页 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'list',
              label: '成分股列表',
              children: (
                <ListTable
                  data={listData?.data || []}
                  columns={[
                    {
                      key: 'marketCap',
                      title: '市值',
                      dataIndex: 'marketCap',
                      format: 'currency',
                      sortable: true,
                    },
                    {
                      key: 'volume',
                      title: '成交量',
                      dataIndex: 'volume',
                      format: 'number',
                      sortable: true,
                    },
                  ]}
                  loading={loading}
                  pagination={{
                    current: listData?.pagination.current || 1,
                    pageSize: listData?.pagination.pageSize || 50,
                    total: listData?.pagination.total || 0,
                  }}
                  onPageChange={handlePageChange}
                  onSort={handleSort}
                  onExport={handleExport}
                  watchlistSymbols={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                />
              ),
            },
            {
              key: 'trend',
              label: '主题趋势',
              children: <div style={{ padding: 24 }}>{renderTrendChart()}</div>,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default AIThemeListPage;
