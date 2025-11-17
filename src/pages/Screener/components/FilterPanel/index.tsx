/**
 * 筛选面板主组件
 */

import React, { useState } from 'react';
import { Collapse, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import type { ScreenerFilters } from '../../types';
import BasicFilters from './BasicFilters';
import TechnicalFilters from './TechnicalFilters';
import FundamentalFilters from './FundamentalFilters';
import CustomRules from './CustomRules';
import AdvancedMode from './AdvancedMode';
import styles from './index.less';

const { Panel } = Collapse;

interface FilterPanelProps {
  filters: ScreenerFilters;
  onFiltersChange: (filters: ScreenerFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  onSave: () => void;
  loading?: boolean;
  industries?: Array<{ code: string; name: string }>;
  sectors?: Array<{ code: string; name: string }>;
  onValidateExpression?: (expression: string) => Promise<{ valid: boolean; errors?: any[] }>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  onSave,
  loading,
  industries,
  sectors,
  onValidateExpression,
}) => {
  const [activeKeys, setActiveKeys] = useState<string[]>(['basic']);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleBasicChange = (value: any) => {
    onFiltersChange({ ...filters, basic: value });
  };

  const handleTechnicalChange = (value: any) => {
    onFiltersChange({ ...filters, technical: value });
  };

  const handleFundamentalChange = (value: any) => {
    onFiltersChange({ ...filters, fundamental: value });
  };

  const handleCustomRulesChange = (value: any) => {
    onFiltersChange({ ...filters, customRules: value });
  };

  const handleExpressionChange = (expression: string) => {
    onFiltersChange({ ...filters, expression });
  };

  const handleAdvancedModeToggle = (enabled: boolean) => {
    setAdvancedMode(enabled);
    if (!enabled) {
      // 关闭高级模式时清空表达式
      onFiltersChange({ ...filters, expression: undefined });
    }
  };

  return (
    <div className={styles.filterPanel}>
      <Collapse
        activeKey={activeKeys}
        onChange={keys => setActiveKeys(keys as string[])}
        bordered={false}
      >
        <Panel header="🔍 基本过滤" key="basic">
          <BasicFilters
            value={filters.basic}
            onChange={handleBasicChange}
            industries={industries}
            sectors={sectors}
          />
        </Panel>

        <Panel header="📈 技术指标" key="technical">
          <TechnicalFilters
            value={filters.technical}
            onChange={handleTechnicalChange}
          />
        </Panel>

        <Panel header="💰 财务指标" key="fundamental">
          <FundamentalFilters
            value={filters.fundamental}
            onChange={handleFundamentalChange}
          />
        </Panel>

        <Panel header="🧱 自定义规则" key="custom">
          <CustomRules
            value={filters.customRules}
            onChange={handleCustomRulesChange}
          />
        </Panel>

        <Panel header="⚡ 高级表达式" key="advanced">
          <AdvancedMode
            enabled={advancedMode}
            expression={filters.expression}
            onToggle={handleAdvancedModeToggle}
            onChange={handleExpressionChange}
            onValidate={onValidateExpression}
          />
        </Panel>
      </Collapse>

      <div className={styles.actionButtons}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            block
            size="large"
          >
            应用筛选
          </Button>
          <Space style={{ width: '100%' }}>
            <Button icon={<SaveOutlined />} onClick={onSave} block>
              保存
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset} block>
              重置
            </Button>
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default FilterPanel;
