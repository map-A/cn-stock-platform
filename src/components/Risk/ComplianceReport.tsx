/**
 * 合规检查报告组件
 * 
 * 功能特性:
 * - 投资限制合规检查
 * - 风险限额监控
 * - 监管要求合规性验证
 * - 合规报告生成和导出
 * - 违规预警和处理
 * 
 * 依据文档: MODULE_PROMPTS.md - 风险管理模块
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Progress,
  Tag,
  Button,
  Space,
  Descriptions,
  Alert,
  Tabs,
  DatePicker,
  Select,
  Statistic,
  Badge,
  Tooltip,
  Modal,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import './ComplianceReport.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 合规规则接口
export interface ComplianceRule {
  id: string;
  name: string;
  category: 'position_limit' | 'risk_limit' | 'sector_limit' | 'regulatory';
  description: string;
  threshold: number;
  unit: 'percent' | 'amount' | 'ratio';
  currentValue: number;
  status: 'compliant' | 'warning' | 'violation';
  lastCheckTime: string;
}

// 合规检查结果接口
export interface ComplianceCheckResult {
  id: string;
  ruleId: string;
  ruleName: string;
  checkTime: string;
  status: 'pass' | 'warning' | 'fail';
  details: string;
  recommendedAction?: string;
}

// 合规报告接口
export interface ComplianceReport {
  id: string;
  reportDate: string;
  overallStatus: 'compliant' | 'issues' | 'violations';
  totalRules: number;
  passedRules: number;
  warningRules: number;
  violatedRules: number;
  summary: string;
}

export interface ComplianceReportProps {
  portfolioId: string;
  loading?: boolean;
}

/**
 * 合规检查报告组件
 */
const ComplianceReport: React.FC<ComplianceReportProps> = ({
  portfolioId,
  loading = false,
}) => {
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [checkResults, setCheckResults] = useState<ComplianceCheckResult[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);

  /**
   * 合规规则分类配置
   */
  const categoryConfig = {
    position_limit: { text: '持仓限制', color: '#1890ff' },
    risk_limit: { text: '风险限额', color: '#722ed1' },
    sector_limit: { text: '行业限制', color: '#13c2c2' },
    regulatory: { text: '监管要求', color: '#fa8c16' },
  };

  /**
   * 合规状态配置
   */
  const statusConfig = {
    compliant: { text: '合规', color: '#52c41a', icon: <CheckCircleOutlined /> },
    warning: { text: '警告', color: '#faad14', icon: <ExclamationCircleOutlined /> },
    violation: { text: '违规', color: '#ff4d4f', icon: <CloseCircleOutlined /> },
  };

  /**
   * 初始化数据
   */
  useEffect(() => {
    generateMockData();
  }, []);

  /**
   * 生成模拟数据
   */
  const generateMockData = () => {
    // 模拟合规规则
    const mockRules: ComplianceRule[] = [
      {
        id: 'rule_001',
        name: '单一股票持仓比例限制',
        category: 'position_limit',
        description: '单只股票持仓不得超过投资组合总资产的10%',
        threshold: 10,
        unit: 'percent',
        currentValue: 8.5,
        status: 'compliant',
        lastCheckTime: dayjs().toISOString(),
      },
      {
        id: 'rule_002',
        name: '行业集中度限制',
        category: 'sector_limit',
        description: '单一行业持仓不得超过投资组合总资产的25%',
        threshold: 25,
        unit: 'percent',
        currentValue: 28.3,
        status: 'violation',
        lastCheckTime: dayjs().toISOString(),
      },
      {
        id: 'rule_003',
        name: 'VaR风险限额',
        category: 'risk_limit',
        description: '95%置信度下的VaR不得超过总资产的5%',
        threshold: 5,
        unit: 'percent',
        currentValue: 4.2,
        status: 'compliant',
        lastCheckTime: dayjs().toISOString(),
      },
      {
        id: 'rule_004',
        name: '杠杆比率限制',
        category: 'regulatory',
        description: '总杠杆比率不得超过2:1',
        threshold: 2,
        unit: 'ratio',
        currentValue: 1.8,
        status: 'compliant',
        lastCheckTime: dayjs().toISOString(),
      },
      {
        id: 'rule_005',
        name: '流动性比率要求',
        category: 'regulatory',
        description: '现金及现金等价物不得低于总资产的5%',
        threshold: 5,
        unit: 'percent',
        currentValue: 3.2,
        status: 'warning',
        lastCheckTime: dayjs().toISOString(),
      },
      {
        id: 'rule_006',
        name: '最大回撤限制',
        category: 'risk_limit',
        description: '最大回撤不得超过15%',
        threshold: 15,
        unit: 'percent',
        currentValue: 12.8,
        status: 'warning',
        lastCheckTime: dayjs().toISOString(),
      },
    ];

    // 模拟检查结果
    const mockResults: ComplianceCheckResult[] = mockRules.map(rule => ({
      id: `result_${rule.id}`,
      ruleId: rule.id,
      ruleName: rule.name,
      checkTime: rule.lastCheckTime,
      status: rule.status === 'compliant' ? 'pass' : rule.status === 'warning' ? 'warning' : 'fail',
      details: `当前值: ${rule.currentValue}${rule.unit === 'percent' ? '%' : rule.unit === 'ratio' ? ':1' : ''}，限制值: ${rule.threshold}${rule.unit === 'percent' ? '%' : rule.unit === 'ratio' ? ':1' : ''}`,
      recommendedAction: rule.status === 'violation' ? '建议调整持仓配置以符合合规要求' : rule.status === 'warning' ? '建议关注并准备调整' : undefined,
    }));

    // 模拟历史报告
    const mockReports: ComplianceReport[] = Array.from({ length: 30 }, (_, index) => {
      const date = dayjs().subtract(index, 'day');
      const totalRules = 6;
      const violatedRules = Math.floor(Math.random() * 2);
      const warningRules = Math.floor(Math.random() * 2);
      const passedRules = totalRules - violatedRules - warningRules;
      
      return {
        id: `report_${date.format('YYYY-MM-DD')}`,
        reportDate: date.toISOString(),
        overallStatus: violatedRules > 0 ? 'violations' : warningRules > 0 ? 'issues' : 'compliant',
        totalRules,
        passedRules,
        warningRules,
        violatedRules,
        summary: `共检查${totalRules}项合规规则，${passedRules}项通过，${warningRules}项警告，${violatedRules}项违规`,
      };
    });

    setComplianceRules(mockRules);
    setCheckResults(mockResults);
    setReports(mockReports);
  };

  /**
   * 运行合规检查
   */
  const runComplianceCheck = async () => {
    message.info('正在运行合规检查...');
    
    // 模拟检查过程
    setTimeout(() => {
      generateMockData();
      message.success('合规检查完成');
    }, 2000);
  };

  /**
   * 导出合规报告
   */
  const exportReport = () => {
    message.success('合规报告导出成功');
  };

  /**
   * 查看规则详情
   */
  const viewRuleDetail = (rule: ComplianceRule) => {
    setSelectedRule(rule);
    setDetailModalVisible(true);
  };

  /**
   * 获取筛选后的规则
   */
  const getFilteredRules = () => {
    return complianceRules.filter(rule => {
      if (filterCategory !== 'all' && rule.category !== filterCategory) return false;
      if (filterStatus !== 'all' && rule.status !== filterStatus) return false;
      return true;
    });
  };

  /**
   * 合规规则表格列配置
   */
  const ruleColumns: ColumnsType<ComplianceRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: keyof typeof categoryConfig) => (
        <Tag color={categoryConfig[category].color}>
          {categoryConfig[category].text}
        </Tag>
      ),
    },
    {
      title: '当前值',
      dataIndex: 'currentValue',
      key: 'currentValue',
      width: 100,
      render: (value: number, record) => (
        <span>
          {value}{record.unit === 'percent' ? '%' : record.unit === 'ratio' ? ':1' : ''}
        </span>
      ),
    },
    {
      title: '限制值',
      dataIndex: 'threshold',
      key: 'threshold',
      width: 100,
      render: (value: number, record) => (
        <span>
          {value}{record.unit === 'percent' ? '%' : record.unit === 'ratio' ? ':1' : ''}
        </span>
      ),
    },
    {
      title: '使用率',
      key: 'usage',
      width: 120,
      render: (_, record) => {
        const usage = (record.currentValue / record.threshold) * 100;
        let status: 'success' | 'normal' | 'exception' = 'success';
        if (usage > 100) status = 'exception';
        else if (usage > 80) status = 'normal';
        
        return (
          <Progress
            percent={Math.min(usage, 100)}
            size="small"
            status={status}
            format={() => `${usage.toFixed(1)}%`}
          />
        );
      },
    },
    {
      title: '合规状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof statusConfig) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '最后检查',
      dataIndex: 'lastCheckTime',
      key: 'lastCheckTime',
      width: 120,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<InfoCircleOutlined />}
          onClick={() => viewRuleDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  /**
   * 计算合规统计
   */
  const getComplianceStatistics = () => {
    const filteredRules = getFilteredRules();
    const total = filteredRules.length;
    const compliant = filteredRules.filter(rule => rule.status === 'compliant').length;
    const warning = filteredRules.filter(rule => rule.status === 'warning').length;
    const violation = filteredRules.filter(rule => rule.status === 'violation').length;
    
    return { total, compliant, warning, violation };
  };

  const statistics = getComplianceStatistics();

  return (
    <div className="compliance-report">
      {/* 统计概览 */}
      <Row gutter={16} className="compliance-statistics">
        <Col span={6}>
          <Card>
            <Statistic
              title="总规则数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="合规通过"
              value={statistics.compliant}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="警告"
              value={statistics.warning}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="违规"
              value={statistics.violation}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card className="action-panel">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Select
                value={filterCategory}
                onChange={setFilterCategory}
                style={{ width: 120 }}
              >
                <Option value="all">全部分类</Option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.text}</Option>
                ))}
              </Select>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 120 }}
              >
                <Option value="all">全部状态</Option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.text}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={runComplianceCheck}
                loading={loading}
              >
                运行检查
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={exportReport}
              >
                导出报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 合规状态概览 */}
      {statistics.violation > 0 && (
        <Alert
          message="发现合规违规"
          description={`当前有 ${statistics.violation} 项规则违规，${statistics.warning} 项规则警告，请及时处理以避免监管风险。`}
          type="error"
          showIcon
          className="compliance-alert"
        />
      )}

      {statistics.violation === 0 && statistics.warning > 0 && (
        <Alert
          message="存在合规警告"
          description={`当前有 ${statistics.warning} 项规则处于警告状态，建议关注并准备调整。`}
          type="warning"
          showIcon
          className="compliance-alert"
        />
      )}

      {statistics.violation === 0 && statistics.warning === 0 && (
        <Alert
          message="合规状态良好"
          description="所有合规规则均通过检查，投资组合符合监管要求。"
          type="success"
          showIcon
          className="compliance-alert"
        />
      )}

      {/* 合规规则详情 */}
      <Card title="合规规则监控">
        <Table
          columns={ruleColumns}
          dataSource={getFilteredRules()}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条规则`,
          }}
        />
      </Card>

      {/* 规则详情弹窗 */}
      <Modal
        title="合规规则详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRule && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="规则名称">
                {selectedRule.name}
              </Descriptions.Item>
              <Descriptions.Item label="规则描述">
                {selectedRule.description}
              </Descriptions.Item>
              <Descriptions.Item label="规则分类">
                <Tag color={categoryConfig[selectedRule.category].color}>
                  {categoryConfig[selectedRule.category].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="限制值">
                {selectedRule.threshold}{selectedRule.unit === 'percent' ? '%' : selectedRule.unit === 'ratio' ? ':1' : ''}
              </Descriptions.Item>
              <Descriptions.Item label="当前值">
                {selectedRule.currentValue}{selectedRule.unit === 'percent' ? '%' : selectedRule.unit === 'ratio' ? ':1' : ''}
              </Descriptions.Item>
              <Descriptions.Item label="使用率">
                <Progress
                  percent={Math.min((selectedRule.currentValue / selectedRule.threshold) * 100, 100)}
                  status={selectedRule.status === 'violation' ? 'exception' : selectedRule.status === 'warning' ? 'normal' : 'success'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="合规状态">
                <Tag color={statusConfig[selectedRule.status].color} icon={statusConfig[selectedRule.status].icon}>
                  {statusConfig[selectedRule.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最后检查时间">
                {dayjs(selectedRule.lastCheckTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedRule.status !== 'compliant' && (
              <Alert
                message={selectedRule.status === 'violation' ? '合规违规' : '合规警告'}
                description={
                  selectedRule.status === 'violation'
                    ? '该规则已违规，请立即调整投资组合以符合合规要求'
                    : '该规则接近违规阈值，建议关注并准备调整'
                }
                type={selectedRule.status === 'violation' ? 'error' : 'warning'}
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComplianceReport;