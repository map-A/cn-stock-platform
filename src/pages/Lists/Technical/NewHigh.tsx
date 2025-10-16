/**
 * 突破新高列表页
 */

import React, { useState } from 'react';
import { Card, message, Alert, Space, Radio } from 'antd';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { RiseOutlined } from '@ant-design/icons';
import ListTable from '@/components/Lists/ListTable';
import listService, { ListType, type ListQueryParams } from '@/services/listService';
import { useWatchlistStore } from '@/stores/watchlist';

const { Statistic } = StatisticCard;

const NewHighListPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('1y');
  const [queryParams, setQueryParams] = useState<ListQueryParams>({
    type: ListType.NEW_HIGH,
    page: 1,
    pageSize: 50,
    sortBy: 'changePercent',
    sortOrder: 'descend',
    filters: { timeRange: '1y' },
  });

  const { watchlist, toggleWatchlist } = useWatchlistStore();

  // 获取列表数据
  const { data: listData, loading } = useRequest(
    () => listService.getList(queryParams),
    {
      refreshDeps: [queryParams],
    },
  );

  /**
   * 处理时间范围变化
   */
  const handleTimeRangeChange = (value: typeof timeRange) => {
    setTimeRange(value);
    setQueryParams((prev) => ({
      ...prev,
      filters: { ...prev.filters, timeRange: value },
      page: 1,
    }));
  };

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
      a.download = `突破新高_${new Date().toISOString().split('T')[0]}.xlsx`;
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
   * 计算统计数据
   */
  const stats = React.useMemo(() => {
    if (!listData?.data) return null;

    const avgChange =
      listData.data.reduce((sum, item) => sum + item.changePercent, 0) / listData.data.length;

    const strongCount = listData.data.filter((item) => item.changePercent > 5).length;

    return {
      total: listData.pagination.total,
      avgChange: avgChange.toFixed(2),
      strongCount,
    };
  }, [listData]);

  return (
    <PageContainer
      header={{
        title: '突破新高',
        subTitle: '股价创历史新高或阶段新高的股票',
        extra: [
          <Radio.Group
            key="timeRange"
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="1m">近1月</Radio.Button>
            <Radio.Button value="3m">近3月</Radio.Button>
            <Radio.Button value="6m">近6月</Radio.Button>
            <Radio.Button value="1y">近1年</Radio.Button>
            <Radio.Button value="all">历史新高</Radio.Button>
          </Radio.Group>,
        ],
      }}
    >
      {/* 提示信息 */}
      <Alert
        message="技术信号提示"
        description="突破新高往往意味着突破了重要阻力位，可能开启新的上涨趋势，但也要注意量能配合和市场整体环境。"
        type="info"
        showIcon
        icon={<RiseOutlined />}
        style={{ marginBottom: 16 }}
      />

      {/* 统计卡片 */}
      {stats && (
        <ProCard split="vertical" ghost style={{ marginBottom: 16 }}>
          <StatisticCard
            statistic={{
              title: '突破新高股票',
              value: stats.total,
              suffix: '只',
            }}
          />
          <StatisticCard
            statistic={{
              title: '平均涨幅',
              value: stats.avgChange,
              suffix: '%',
              valueStyle: { color: '#f5222d' },
            }}
          />
          <StatisticCard
            statistic={{
              title: '强势股(涨幅>5%)',
              value: stats.strongCount,
              suffix: '只',
              valueStyle: { color: '#f5222d' },
            }}
          />
        </ProCard>
      )}

      {/* 列表表格 */}
      <Card>
        <ListTable
          data={listData?.data || []}
          columns={[
            {
              key: 'highDate',
              title: '创新高日期',
              dataIndex: 'highDate',
              format: 'date',
              sortable: true,
            },
            {
              key: 'daysFromHigh',
              title: '距新高天数',
              dataIndex: 'daysFromHigh',
              format: 'number',
              sortable: true,
              tooltip: '当前距离创新高的天数',
            },
            {
              key: 'highPrice',
              title: '新高价格',
              dataIndex: 'highPrice',
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
      </Card>
    </PageContainer>
  );
};

export default NewHighListPage;
