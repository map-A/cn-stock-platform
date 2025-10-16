import React, { useEffect, useState } from 'react';
import { Card, Table, Tabs, Tag, Statistic, Row, Col, Empty } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getTopShareholders,
  getShareholderStructure,
  getShareholderChanges,
} from '@/services/insider/shareholderService';
import { formatNumber, formatPercent } from '@/utils/format';
import styles from './index.less';

interface Shareholder {
  id: string;
  reportDate: string;
  shareholderName: string;
  shareholderType: string;
  shares: number;
  holdingRatio: number;
  rank: number;
  changeShares?: number;
  changeRatio?: number;
}

interface ShareholderPanelProps {
  stockCode: string;
}

const ShareholderPanel: React.FC<ShareholderPanelProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [topShareholders, setTopShareholders] = useState<Shareholder[]>([]);
  const [structure, setStructure] = useState<any>(null);
  const [changes, setChanges] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [stockCode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [topRes, structureRes, changesRes] = await Promise.all([
        getTopShareholders(stockCode),
        getShareholderStructure(stockCode),
        getShareholderChanges(stockCode),
      ]);

      if (topRes.success) {
        setTopShareholders(topRes.data || []);
      }
      if (structureRes.success) {
        setStructure(structureRes.data);
      }
      if (changesRes.success) {
        setChanges(changesRes.data || []);
      }
    } catch (error) {
      console.error('加载股东信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShareholderTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      controlling: { color: 'red', text: '控股股东' },
      institution: { color: 'blue', text: '机构股东' },
      individual: { color: 'green', text: '个人股东' },
      state_owned: { color: 'orange', text: '国有股东' },
      foreign: { color: 'purple', text: '外资股东' },
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderChangeTag = (changeRatio?: number, changeShares?: number) => {
    if (changeRatio === undefined || changeShares === undefined) return '-';
    
    const isIncrease = changeShares > 0;
    const icon = isIncrease ? <RiseOutlined /> : <FallOutlined />;
    const color = isIncrease ? '#3f8600' : '#cf1322';
    
    return (
      <span style={{ color }}>
        {icon} {formatPercent(Math.abs(changeRatio))} ({formatNumber(Math.abs(changeShares))})
      </span>
    );
  };

  const topShareholdersColumns: ColumnsType<Shareholder> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (rank: number) => (
        <Tag color={rank <= 3 ? 'gold' : 'default'}>{rank}</Tag>
      ),
    },
    {
      title: '股东名称',
      dataIndex: 'shareholderName',
      key: 'shareholderName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '股东类型',
      dataIndex: 'shareholderType',
      key: 'shareholderType',
      width: 120,
      render: (type: string) => getShareholderTypeTag(type),
    },
    {
      title: '持股数量',
      dataIndex: 'shares',
      key: 'shares',
      width: 140,
      align: 'right',
      render: (shares: number) => formatNumber(shares),
      sorter: (a, b) => a.shares - b.shares,
    },
    {
      title: '持股比例',
      dataIndex: 'holdingRatio',
      key: 'holdingRatio',
      width: 120,
      align: 'right',
      render: (ratio: number) => formatPercent(ratio),
      sorter: (a, b) => a.holdingRatio - b.holdingRatio,
    },
    {
      title: '较上期变动',
      key: 'change',
      width: 180,
      render: (_, record) => renderChangeTag(record.changeRatio, record.changeShares),
    },
    {
      title: '报告期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 120,
    },
  ];

  const changesColumns: ColumnsType<any> = [
    {
      title: '变动日期',
      dataIndex: 'changeDate',
      key: 'changeDate',
      width: 120,
    },
    {
      title: '股东名称',
      dataIndex: 'shareholderName',
      key: 'shareholderName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '变动类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          increase: { color: 'green', text: '增持' },
          decrease: { color: 'red', text: '减持' },
          pledge: { color: 'orange', text: '质押' },
          unpledge: { color: 'blue', text: '解押' },
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '变动数量',
      dataIndex: 'changeShares',
      key: 'changeShares',
      width: 140,
      align: 'right',
      render: (shares: number) => formatNumber(shares),
    },
    {
      title: '变动比例',
      dataIndex: 'changeRatio',
      key: 'changeRatio',
      width: 120,
      align: 'right',
      render: (ratio: number) => formatPercent(ratio),
    },
    {
      title: '变动后持股',
      dataIndex: 'sharesAfter',
      key: 'sharesAfter',
      width: 140,
      align: 'right',
      render: (shares: number) => formatNumber(shares),
    },
  ];

  const tabItems = [
    {
      key: 'top',
      label: '十大股东',
      children: (
        <Table
          loading={loading}
          dataSource={topShareholders}
          columns={topShareholdersColumns}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: <Empty description="暂无股东数据" />,
          }}
        />
      ),
    },
    {
      key: 'changes',
      label: '股东变动',
      children: (
        <Table
          loading={loading}
          dataSource={changes}
          columns={changesColumns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          locale={{
            emptyText: <Empty description="暂无变动记录" />,
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.shareholderPanel}>
      {structure && (
        <Row gutter={16} className={styles.statsRow}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总股本"
                value={structure.totalShares}
                suffix="股"
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="流通股本"
                value={structure.floatShares}
                suffix="股"
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="限售股本"
                value={structure.restrictedShares}
                suffix="股"
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="股东总数"
                value={structure.shareholderCount}
                suffix="户"
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default ShareholderPanel;
