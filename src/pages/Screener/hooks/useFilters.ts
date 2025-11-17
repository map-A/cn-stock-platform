/**
 * 筛选条件状态管理 Hook
 */

import { useState, useCallback } from 'react';
import type { ScreenerFilters, CustomRule } from '../types';

// 生成唯一ID
const generateId = () => `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useFilters = (initialFilters?: ScreenerFilters) => {
  const [filters, setFilters] = useState<ScreenerFilters>(initialFilters || {});

  // 更新基本过滤条件
  const updateBasicFilters = useCallback((updates: Partial<ScreenerFilters['basic']>) => {
    setFilters(prev => ({
      ...prev,
      basic: {
        ...prev.basic,
        ...updates,
      },
    }));
  }, []);

  // 更新技术指标过滤条件
  const updateTechnicalFilters = useCallback((updates: Partial<ScreenerFilters['technical']>) => {
    setFilters(prev => ({
      ...prev,
      technical: {
        ...prev.technical,
        ...updates,
      },
    }));
  }, []);

  // 更新财务指标过滤条件
  const updateFundamentalFilters = useCallback((updates: Partial<ScreenerFilters['fundamental']>) => {
    setFilters(prev => ({
      ...prev,
      fundamental: {
        ...prev.fundamental,
        ...updates,
      },
    }));
  }, []);

  // 添加自定义规则
  const addCustomRule = useCallback((rule: Omit<CustomRule, 'id'>) => {
    const newRule: CustomRule = {
      ...rule,
      id: generateId(),
    };

    setFilters(prev => ({
      ...prev,
      customRules: [...(prev.customRules || []), newRule],
    }));

    return newRule.id;
  }, []);

  // 更新自定义规则
  const updateCustomRule = useCallback((id: string, updates: Partial<CustomRule>) => {
    setFilters(prev => ({
      ...prev,
      customRules: (prev.customRules || []).map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    }));
  }, []);

  // 删除自定义规则
  const removeCustomRule = useCallback((id: string) => {
    setFilters(prev => ({
      ...prev,
      customRules: (prev.customRules || []).filter(rule => rule.id !== id),
    }));
  }, []);

  // 更新表达式
  const updateExpression = useCallback((expression: string) => {
    setFilters(prev => ({
      ...prev,
      expression,
    }));
  }, []);

  // 重置所有过滤条件
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // 加载筛选器配置
  const loadFilters = useCallback((newFilters: ScreenerFilters) => {
    setFilters(newFilters);
  }, []);

  // 序列化过滤条件（用于保存）
  const serializeFilters = useCallback((): string => {
    return JSON.stringify(filters);
  }, [filters]);

  // 反序列化过滤条件（用于加载）
  const deserializeFilters = useCallback((serialized: string) => {
    try {
      const parsed = JSON.parse(serialized);
      setFilters(parsed);
      return true;
    } catch (error) {
      console.error('Failed to deserialize filters:', error);
      return false;
    }
  }, []);

  // 验证过滤条件
  const validateFilters = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 验证基本过滤条件
    if (filters.basic) {
      const { marketCapMin, marketCapMax, priceMin, priceMax } = filters.basic;
      
      if (marketCapMin !== undefined && marketCapMax !== undefined && marketCapMin > marketCapMax) {
        errors.push('市值范围：最小值不能大于最大值');
      }
      
      if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
        errors.push('价格范围：最小值不能大于最大值');
      }
    }

    // 验证财务指标
    if (filters.fundamental) {
      const { peMin, peMax, pbMin, pbMax, roeMin, roeMax } = filters.fundamental;
      
      if (peMin !== undefined && peMax !== undefined && peMin > peMax) {
        errors.push('市盈率范围：最小值不能大于最大值');
      }
      
      if (pbMin !== undefined && pbMax !== undefined && pbMin > pbMax) {
        errors.push('市净率范围：最小值不能大于最大值');
      }
      
      if (roeMin !== undefined && roeMax !== undefined && roeMin > roeMax) {
        errors.push('ROE范围：最小值不能大于最大值');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [filters]);

  // 检查是否有任何过滤条件
  const hasAnyFilter = useCallback((): boolean => {
    return (
      Object.keys(filters.basic || {}).length > 0 ||
      Object.keys(filters.technical || {}).length > 0 ||
      Object.keys(filters.fundamental || {}).length > 0 ||
      (filters.customRules && filters.customRules.length > 0) ||
      !!filters.expression
    );
  }, [filters]);

  return {
    filters,
    updateBasicFilters,
    updateTechnicalFilters,
    updateFundamentalFilters,
    addCustomRule,
    updateCustomRule,
    removeCustomRule,
    updateExpression,
    resetFilters,
    loadFilters,
    serializeFilters,
    deserializeFilters,
    validateFilters,
    hasAnyFilter,
  };
};
