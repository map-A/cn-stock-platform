/**
 * 股票筛选器主页面
 */

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, message, Modal, Form, Input, Button, Space } from 'antd';
import screenerService from '@/services/screener';
import { useFilters } from './hooks/useFilters';
import { useScreener } from './hooks/useScreener';
import { useCharts } from './hooks/useCharts';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import FilterPanel from './components/FilterPanel';
import ResultPanel from './components/ResultPanel';
import SavedScreeners from './components/SavedScreeners';
import ChartArea from './components/ResultPanel/ChartArea';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import type { SavedScreener } from './types';
import styles from './index.less';

const Screener: React.FC = () => {
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveForm] = Form.useForm();
  const [industries, setIndustries] = useState<Array<{ code: string; name: string }>>([]);
  const [sectors, setSectors] = useState<Array<{ code: string; name: string }>>([]);
  const [showSavedScreeners, setShowSavedScreeners] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 使用自定义 Hooks
  const {
    filters,
    updateBasicFilters,
    updateTechnicalFilters,
    updateFundamentalFilters,
    addCustomRule,
    updateCustomRule,
    removeCustomRule,
    resetFilters,
    loadFilters,
    validateFilters,
    hasAnyFilter,
  } = useFilters();

  const {
    loading,
    results,
    total,
    currentPage,
    pageSize,
    executeScreen,
    changePage,
    resetResults,
    exportResults,
  } = useScreener();

  const {
    chartMode,
    selectedStocks,
    selectStock,
    toggleChartMode,
  } = useCharts();

  // 加载元数据
  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [industriesRes, sectorsRes] = await Promise.all([
        screenerService.getIndustries(),
        screenerService.getSectors(),
      ]);

      if (industriesRes.success && industriesRes.data) {
        setIndustries(industriesRes.data);
      }
      if (sectorsRes.success && sectorsRes.data) {
        setSectors(sectorsRes.data);
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
    }
  };

  // 处理筛选
  const handleSearch = async () => {
    const validation = validateFilters();
    if (!validation.valid) {
      message.error(validation.errors[0]);
      return;
    }

    if (!hasAnyFilter()) {
      message.warning('请至少设置一个筛选条件');
      return;
    }

    await executeScreen(filters, 1, pageSize);
  };

  // 处理重置
  const handleReset = () => {
    resetFilters();
    resetResults();
    message.success('已重置所有筛选条件');
  };

  // 处理保存筛选器
  const handleSave = () => {
    if (!hasAnyFilter()) {
      message.warning('请至少设置一个筛选条件');
      return;
    }
    setSaveModalVisible(true);
  };

  // 确认保存筛选器
  const handleSaveConfirm = async () => {
    try {
      const values = await saveForm.validateFields();
      const response = await screenerService.saveScreener({
        name: values.name,
        description: values.description,
        filters,
      });

      if (response.success) {
        message.success('筛选器保存成功');
        setSaveModalVisible(false);
        saveForm.resetFields();
      } else {
        message.error('保存失败，请重试');
      }
    } catch (error) {
      console.error('Save error:', error);
      message.error('保存失败');
    }
  };

  // 保存为策略
  const handleSaveAsStrategy = async () => {
    try {
      Modal.confirm({
        title: '保存为策略',
        content: '确定要将当前筛选器保存为策略吗？',
        onOk: async () => {
          const response = await screenerService.saveAsStrategy({
            name: `筛选策略_${new Date().toLocaleDateString()}`,
            filters,
          });

          if (response.success) {
            message.success('策略保存成功');
          } else {
            message.error('保存失败');
          }
        },
      });
    } catch (error) {
      console.error('Save as strategy error:', error);
      message.error('保存失败');
    }
  };

  // 处理导出
  const handleExport = async (type: 'current' | 'all') => {
    if (type === 'all') {
      await exportResults(filters);
    } else {
      message.info('导出当前页功能开发中');
    }
  };

  // 处理分页
  const handlePageChange = (page: number, size: number) => {
    changePage(page, size);
    executeScreen(filters, page, size);
  };

  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: typeof filters) => {
    loadFilters(newFilters);
  };

  // 加载保存的筛选器
  const handleLoadScreener = (screener: SavedScreener) => {
    loadFilters(screener.filters);
    setShowSavedScreeners(false);
    message.success(`已加载筛选器: ${screener.name}`);
  };

  // 验证表达式
  const handleValidateExpression = async (expression: string) => {
    try {
      const response = await screenerService.validateExpression(expression);
      if (response.success && response.data) {
        return response.data;
      }
      return { valid: false, errors: [{ message: '验证失败' }] };
    } catch (error) {
      return { valid: false, errors: [{ message: '验证服务异常' }] };
    }
  };

  // 集成键盘快捷键
  useKeyboardShortcuts({
    onSave: handleSave,
    onSearch: handleSearch,
    onReset: handleReset,
    onEscape: () => {
      if (saveModalVisible) {
        setSaveModalVisible(false);
        saveForm.resetFields();
      }
      if (drawerVisible) {
        setDrawerVisible(false);
      }
    },
  });

  return (
    <PageContainer
      title="股票筛选器"
      subTitle="专业的股票筛选工具"
      className={styles.screenerPage}
      extra={
        <Space>
          <KeyboardShortcutsHelp />
          <Button
            type={showSavedScreeners ? 'primary' : 'default'}
            onClick={() => setShowSavedScreeners(!showSavedScreeners)}
          >
            {showSavedScreeners ? '隐藏' : '显示'}筛选器库
          </Button>
        </Space>
      }
    >
      {/* 筛选器库 */}
      {showSavedScreeners && (
        <div style={{ marginBottom: 16 }}>
          <SavedScreeners onLoad={handleLoadScreener} />
        </div>
      )}

      <div className={styles.content}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧筛选面板 */}
          <Col span={6} style={{ height: '100%' }}>
            <div className={styles.filterPanelWrapper}>
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onReset={handleReset}
                onSave={handleSave}
                loading={loading}
                industries={industries}
                sectors={sectors}
                onValidateExpression={handleValidateExpression}
              />
            </div>
          </Col>

          {/* 右侧结果面板 */}
          <Col span={18} style={{ height: '100%' }}>
            <div className={styles.resultPanelWrapper}>
              <ResultPanel
                data={results}
                total={total}
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  onChange: handlePageChange,
                }}
                filters={filters}
                onExport={handleExport}
                onSaveFilters={handleSave}
                onSaveAsStrategy={handleSaveAsStrategy}
                onReset={handleReset}
              />

              {/* 图表区域 */}
              <ChartArea
                selectedStocks={selectedStocks}
                loading={loading}
                onModeChange={toggleChartMode}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* 保存筛选器弹窗 */}
      <Modal
        title="保存筛选器"
        open={saveModalVisible}
        onOk={handleSaveConfirm}
        onCancel={() => {
          setSaveModalVisible(false);
          saveForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={saveForm} layout="vertical">
          <Form.Item
            name="name"
            label="筛选器名称"
            rules={[{ required: true, message: '请输入筛选器名称' }]}
          >
            <Input placeholder="例如：高成长低估值" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea
              rows={3}
              placeholder="简单描述筛选器的用途和条件"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Screener;
