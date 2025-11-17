/**
 * 策略详情页 - 代码模式
 * 
 * 布局结构：
 * - 顶部：运行回测按钮
 * - 三栏布局：左侧文件树 | 中间代码编辑器 | 右侧属性面板
 * - 底部：回测结果展示区（运行后显示）
 */

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, message, Spin, Tag } from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  DownloadOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useParams } from '@umijs/max';
import type { Strategy } from '@/typings/strategy';
import CodeMode from './CodeMode';
import BacktestResultPanel from './components/BacktestResultPanel';
import styles from './index.less';

const StrategyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showBacktestResult, setShowBacktestResult] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any>(null);
  const [backtestLoading, setBacktestLoading] = useState(false);

  // 加载策略数据
  useEffect(() => {
    loadStrategy();
  }, [id]);

  const loadStrategy = async () => {
    setLoading(true);
    try {
      // TODO: 调用真实 API
      // const data = await strategyService.getById(id);
      
      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockStrategy: Strategy = {
        id: id || '1',
        name: '均线交叉策略',
        description: '基于 MA10 和 MA20 的交叉信号',
        type: 'trend',
        status: 'active',
        author: '张三',
        tags: ['均线', '趋势'],
        mode: 'code',
        version: 3,
        parameters: [
          { key: 'fast_period', label: '快线周期', type: 'number', value: 10, min: 5, max: 50 },
          { key: 'slow_period', label: '慢线周期', type: 'number', value: 20, min: 10, max: 100 },
          { key: 'initial_capital', label: '初始资金', type: 'number', value: 100000 },
          { key: 'commission', label: '手续费率', type: 'number', value: 0.001, step: 0.0001 },
        ],
        createdAt: '2024-10-01T10:00:00Z',
        updatedAt: '2024-11-15T14:30:00Z',
      };
      
      setStrategy(mockStrategy);
    } catch (error) {
      message.error('加载策略失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 保存策略
  const handleSave = async () => {
    message.loading({ content: '保存中...', key: 'save' });
    try {
      // TODO: 调用保存 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success({ content: '保存成功', key: 'save' });
      setHasChanges(false);
    } catch (error) {
      message.error({ content: '保存失败', key: 'save' });
    }
  };

  // 快速回测
  const handleQuickRun = () => {
    message.loading('启动快速回测...', 2);
    // TODO: 实现快速回测
  };

  // 导出代码
  const handleExport = () => {
    message.info('导出功能开发中...');
    // TODO: 实现导出
  };

  // 查看版本历史
  const handleVersions = () => {
    message.info('版本历史功能开发中...');
    // TODO: 实现版本历史
  };

  // 运行回测
  const handleRunBacktest = async () => {
    setBacktestLoading(true);
    setShowBacktestResult(true);
    message.loading({ content: '正在运行回测...', key: 'backtest', duration: 0 });

    try {
      // TODO: 调用真实 API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 模拟回测结果
      const mockResult = {
        id: 'bt_' + Date.now(),
        config: {
          symbol: '600000.SH',
          initialCapital: 100000,
          commission: 0.001,
          slippage: 0.001,
          startDate: '2024-01-01',
          endDate: '2024-11-01',
        },
        summary: {
          totalReturn: 15.6,
          annualizedReturn: 14.2,
          maxDrawdown: -8.5,
          sharpeRatio: 1.82,
          sortinoRatio: 2.15,
          winRate: 65.5,
          totalTrades: 45,
        },
        equity: Array.from({ length: 200 }, (_, i) => ({
          date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
          value: 100000 + i * 200 + Math.random() * 2000 - 500,
        })),
        trades: Array.from({ length: 45 }, (_, i) => ({
          id: i + 1,
          entryDate: new Date(2024, 0, Math.floor(i * 4.5) + 1).toISOString().split('T')[0],
          exitDate: new Date(2024, 0, Math.floor(i * 4.5) + 4).toISOString().split('T')[0],
          side: i % 3 === 0 ? 'short' : 'long',
          entryPrice: 10 + Math.random() * 2,
          exitPrice: 10 + Math.random() * 2,
          quantity: Math.floor(Math.random() * 500) + 100,
          profit: (Math.random() - 0.4) * 5000,
          profitPercent: (Math.random() - 0.4) * 15,
        })),
      };

      setBacktestResult(mockResult);
      message.success({ content: '回测完成！', key: 'backtest' });
    } catch (error) {
      message.error({ content: '回测失败', key: 'backtest' });
    } finally {
      setBacktestLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!strategy) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          策略不存在
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: strategy.name,
        subTitle: strategy.description,
        tags: strategy.tags.map((tag, index) => <Tag key={index} color="blue">{tag}</Tag>),
        extra: [
          <Button
            key="versions"
            icon={<HistoryOutlined />}
            onClick={handleVersions}
          >
            v{strategy.version}
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            保存
          </Button>,
          <Button
            key="run"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRunBacktest}
            loading={backtestLoading}
            size="large"
          >
            运行回测
          </Button>,
        ],
        breadcrumb: {
          items: [
            { path: '/', title: '首页' },
            { path: '/strategy/list', title: '策略管理' },
            { title: strategy.name },
          ],
        },
      }}
      className={styles.strategyDetail}
    >
      <div className={styles.strategyContainer}>
        {/* 代码编辑器 */}
        <CodeMode
          strategy={strategy}
          onChange={() => setHasChanges(true)}
        />

        {/* 底部：回测结果展示区 */}
        {showBacktestResult && (
          <BacktestResultPanel
            result={backtestResult}
            loading={backtestLoading}
            onClose={() => setShowBacktestResult(false)}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default StrategyDetail;
