/**
 * 高股息率列表页
 */

import React, { useState, useEffect } from 'react';
import { Card, message, Statistic, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import ListTable from '@/components/Lists/ListTable';
import listService, { ListType, type ListQueryParams } from '@/services/listService';
import { useWatchlistStore } from '@/stores/watchlist';

const HighYieldDividendListPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<ListQueryParams>({
    type: ListType.HIGH_DIVIDEND,
    page: 1,
    pageSize: 50,
    sortBy: 'indicators.dividendYield',
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

  // 获取列表元数据
  const { data: metadata } = useRequest(
    () => listService.getListMetadata(ListType.HIGH_DIVIDEND),
    {
      cacheKey: 'high-dividend-metadata',
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
      a.download = `高股息率股票_${new Date().toISOString().split('T')[0]}.xlsx`;
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

    const avgYield =
      listData.data.reduce((sum, item) => sum + (item.indicators.dividendYield || 0), 0) /
      listData.data.length;

    const avgMarketCap =
      listData.data.reduce((sum, item) => sum + (item.marketCap || 0), 0) / listData.data.length;

    return {
      total: listData.pagination.total,
      avgYield: avgYield.toFixed(2),
      avgMarketCap: (avgMarketCap / 100000000).toFixed(0),
    };
  }, [listData]);

  return (
    <PageContainer
      header={{
        title: metadata?.title || '高股息率股票',
        subTitle: metadata?.description || '筛选股息率超过3%的优质分红股',
      }}
    >
      {/* 统计卡片 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic title="股票总数" value={stats.total} suffix="只" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均股息率"
                value={stats.avgYield}
                suffix="%"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均市值"
                value={stats.avgMarketCap}
                suffix="亿元"
                precision={0}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 列表表格 */}
      <Card>
        <ListTable
          data={listData?.data || []}
          columns={metadata?.columns || []}
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

export default HighYieldDividendListPage;
