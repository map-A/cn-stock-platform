/**
 * 回测报告组件
 * 
 * 功能特性:
 * - 完整报告生成
 * - PDF导出
 * - Excel导出
 * - 图表生成
 * - 分析总结
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Descriptions,
  Space,
  Divider,
  Alert,
  message,
  Spin,
  Table,
} from 'antd';
import {
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import type { BacktestReport, BacktestResults } from '@/typings/backtest';
import { formatNumber, formatPercent, formatCurrency } from '@/utils/format';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;

interface BacktestReportProps {
  backtestId: string;
  results: BacktestResults;
  report?: BacktestReport;
  loading?: boolean;
  onGenerateReport?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

const BacktestReportComponent: React.FC<BacktestReportProps> = ({
  backtestId,
  results,
  report,
  loading = false,
  onGenerateReport,
  onExportPDF,
  onExportExcel,
}) => {
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      await onGenerateReport?.();
      message.success('报告生成成功');
    } catch (error) {
      message.error('报告生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      await onExportPDF?.();
      message.success('PDF导出成功');
    } catch (error) {
      message.error('PDF导出失败');
    }
  };

  const handleExportExcel = async () => {
    try {
      await onExportExcel?.();
      message.success('Excel导出成功');
    } catch (error) {
      message.error('Excel导出失败');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>报告加载中...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <Alert
        message="无可用数据"
        description="请先完成回测以生成报告"
        type="warning"
        style={{ margin: '24px' }}
      />
    );
  }

  // 操作按钮
  const ActionButtons = () => (
    <Space>
      <Button
        type="primary"
        icon={<EyeOutlined />}
        loading={generating}
        onClick={handleGenerateReport}
      >
        生成报告
      </Button>
      {report && (
        <>
          <Button
            icon={<FilePdfOutlined />}
            onClick={handleExportPDF}
          >
            导出PDF
          </Button>
          <Button
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
          >
            导出Excel
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            打印
          </Button>
        </>
      )}
    </Space>
  );

  // 执行摘要
  const ExecutiveSummary = () => {
    const { performance, trades } = results;
    
    return (
      <Card title="执行摘要" style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="策略名称">
            {results.config.strategyId}
          </Descriptions.Item>
          <Descriptions.Item label="回测期间">
            {results.config.startDate} 至 {results.config.endDate}
          </Descriptions.Item>
          <Descriptions.Item label="初始资金">
            {formatCurrency(results.config.initialCapital)}
          </Descriptions.Item>
          <Descriptions.Item label="总收益率">
            <Text style={{ color: performance.totalReturn >= 0 ? '#3f8600' : '#cf1322' }}>
              {formatPercent(performance.totalReturn)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="年化收益率">
            <Text style={{ color: performance.annualizedReturn >= 0 ? '#3f8600' : '#cf1322' }}>
              {formatPercent(performance.annualizedReturn)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="夏普比率">
            <Text style={{ color: performance.sharpeRatio >= 1 ? '#3f8600' : '#cf1322' }}>
              {formatNumber(performance.sharpeRatio, 2)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="最大回撤">
            <Text style={{ color: '#cf1322' }}>
              {formatPercent(Math.abs(performance.maxDrawdown))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="胜率">
            <Text style={{ color: performance.winRate >= 50 ? '#3f8600' : '#cf1322' }}>
              {formatPercent(performance.winRate)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="交易次数" span={2}>
            {trades.totalTrades} 笔 (盈利: {trades.winningTrades}, 亏损: {trades.losingTrades})
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // 净值曲线图表
  const EquityChart = () => {
    const data = results.timeSeries.equity.map(item => ({
      date: item.date,
      value: item.value,
      type: '策略净值'
    }));

    const config = {
      data,
      xField: 'date',
      yField: 'value',
      smooth: true,
      height: 300,
      point: {
        size: 2,
        shape: 'circle',
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: '净值',
          value: formatNumber(datum.value, 4),
        }),
      },
    };

    return (
      <Card title="净值走势图" style={{ marginBottom: 24 }}>
        <Line {...config} />
      </Card>
    );
  };

  // 回撤图表
  const DrawdownChart = () => {
    const data = results.timeSeries.equity.map(item => ({
      date: item.date,
      drawdown: item.drawdown * 100,
    }));

    const config = {
      data,
      xField: 'date',
      yField: 'drawdown',
      height: 300,
      color: '#cf1322',
      area: {
        style: {
          fill: 'l(270) 0:#ffffff 0.5:#cf1322 1:#cf1322',
          fillOpacity: 0.3,
        },
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: '回撤',
          value: `${datum.drawdown.toFixed(2)}%`,
        }),
      },
    };

    return (
      <Card title="回撤走势图" style={{ marginBottom: 24 }}>
        <Column {...config} />
      </Card>
    );
  };

  // 月度收益表格
  const MonthlyReturnsTable = () => {
    const columns = [
      {
        title: '月份',
        dataIndex: 'period',
        key: 'period',
      },
      {
        title: '收益率',
        dataIndex: 'return',
        key: 'return',
        render: (value: number) => (
          <Text style={{ color: value >= 0 ? '#3f8600' : '#cf1322' }}>
            {formatPercent(value)}
          </Text>
        ),
      },
      {
        title: '基准收益率',
        dataIndex: 'benchmark',
        key: 'benchmark',
        render: (value?: number) => value ? formatPercent(value) : '-',
      },
    ];

    return (
      <Card title="月度收益明细" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={results.periodicReturns.monthly}
          pagination={false}
          size="small"
        />
      </Card>
    );
  };

  // 风险分析
  const RiskAnalysis = () => (
    <Card title="风险分析" style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="95% VaR">
              {formatPercent(results.risk.var95)}
            </Descriptions.Item>
            <Descriptions.Item label="95% CVaR">
              {formatPercent(results.risk.cvar95)}
            </Descriptions.Item>
            <Descriptions.Item label="下行标准差">
              {formatPercent(results.risk.downsideDeviation)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={12}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Beta">
              {formatNumber(results.risk.beta || 0, 2)}
            </Descriptions.Item>
            <Descriptions.Item label="Alpha">
              {formatPercent(results.risk.alpha || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="信息比率">
              {formatNumber(results.risk.informationRatio || 0, 2)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  // 分析结论
  const AnalysisConclusions = () => {
    if (!report?.analysis) return null;

    return (
      <Card title="分析结论" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>性能分析</Title>
          <Paragraph>{report.analysis.performanceAnalysis}</Paragraph>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>风险分析</Title>
          <Paragraph>{report.analysis.riskAnalysis}</Paragraph>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>交易分析</Title>
          <Paragraph>{report.analysis.tradeAnalysis}</Paragraph>
        </div>
        
        {report.analysis.conclusions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>主要结论</Title>
            <ul>
              {report.analysis.conclusions.map((conclusion, index) => (
                <li key={index}>{conclusion}</li>
              ))}
            </ul>
          </div>
        )}
        
        {report.analysis.recommendations.length > 0 && (
          <div>
            <Title level={5}>改进建议</Title>
            <ul>
              {report.analysis.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }} className="backtest-report">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>回测报告</Title>
        <ActionButtons />
      </div>

      {report && (
        <Alert
          message={`报告生成时间: ${moment(report.generatedAt).format('YYYY-MM-DD HH:mm:ss')}`}
          type="info"
          style={{ marginBottom: 24 }}
        />
      )}

      <ExecutiveSummary />
      <EquityChart />
      <DrawdownChart />
      <Row gutter={16}>
        <Col span={12}>
          <MonthlyReturnsTable />
        </Col>
        <Col span={12}>
          <RiskAnalysis />
        </Col>
      </Row>
      <AnalysisConclusions />
    </div>
  );
};

export default BacktestReportComponent;