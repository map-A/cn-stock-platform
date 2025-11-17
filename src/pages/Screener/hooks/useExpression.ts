/**
 * 表达式处理 Hook
 */

import { useState, useCallback } from 'react';
import screenerService from '@/services/screener';
import type { CustomRule, ExpressionValidation } from '../types';
import { getFieldLabel, getOperatorSymbol } from '../constants/filterOptions';

export const useExpression = () => {
  const [expression, setExpression] = useState('');
  const [validation, setValidation] = useState<ExpressionValidation>({ valid: true });
  const [validating, setValidating] = useState(false);

  // 更新表达式
  const updateExpression = useCallback((expr: string) => {
    setExpression(expr);
    setValidation({ valid: true }); // 清除之前的验证结果
  }, []);

  // 验证表达式
  const validateExpression = useCallback(async (expr?: string) => {
    const exprToValidate = expr || expression;
    if (!exprToValidate.trim()) {
      setValidation({ valid: true });
      return { valid: true };
    }

    setValidating(true);
    try {
      const response = await screenerService.validateExpression(exprToValidate);
      if (response.success && response.data) {
        setValidation(response.data);
        return response.data;
      }
      return { valid: false, errors: [{ line: 1, column: 1, message: '验证失败' }] };
    } catch (error) {
      console.error('Expression validation error:', error);
      return { valid: false, errors: [{ line: 1, column: 1, message: '验证服务异常' }] };
    } finally {
      setValidating(false);
    }
  }, [expression]);

  // 规则列表转表达式
  const rulesToExpression = useCallback((rules: CustomRule[]): string => {
    if (rules.length === 0) return '';

    return rules
      .map((rule, index) => {
        const fieldLabel = getFieldLabel(rule.field);
        const operatorSymbol = getOperatorSymbol(rule.operator);
        let condition = '';

        if (rule.operator === 'between' && Array.isArray(rule.value)) {
          condition = `(${fieldLabel} >= ${rule.value[0]} AND ${fieldLabel} <= ${rule.value[1]})`;
        } else if (rule.operator === 'in' && Array.isArray(rule.value)) {
          condition = `${fieldLabel} IN (${rule.value.join(', ')})`;
        } else {
          condition = `${fieldLabel} ${operatorSymbol} ${rule.value}`;
        }

        // 添加逻辑运算符
        if (index < rules.length - 1 && rule.logicalOperator) {
          condition += ` ${rule.logicalOperator} `;
        }

        return condition;
      })
      .join('');
  }, []);

  // 表达式转规则列表（简化版，实际需要完整的解析器）
  const expressionToRules = useCallback((expr: string): CustomRule[] => {
    // 这里是简化实现，实际应该使用完整的AST解析器
    const rules: CustomRule[] = [];
    
    // 简单的解析逻辑（示例）
    // 实际项目中应该使用专业的表达式解析库
    try {
      // 按 AND/OR 分割
      const parts = expr.split(/\s+(AND|OR)\s+/gi);
      
      // 这里需要完整的解析逻辑
      // 暂时返回空数组，实际项目中需要实现
      console.warn('Expression to rules conversion not fully implemented');
      
    } catch (error) {
      console.error('Failed to parse expression:', error);
    }

    return rules;
  }, []);

  // 清空表达式
  const clearExpression = useCallback(() => {
    setExpression('');
    setValidation({ valid: true });
  }, []);

  // 插入示例表达式
  const insertExample = useCallback((example: string) => {
    setExpression(prev => {
      if (prev.trim()) {
        return `${prev}\n${example}`;
      }
      return example;
    });
  }, []);

  return {
    expression,
    validation,
    validating,
    updateExpression,
    validateExpression,
    rulesToExpression,
    expressionToRules,
    clearExpression,
    insertExample,
  };
};

// 预定义的表达式示例
export const EXPRESSION_EXAMPLES = [
  {
    name: '高成长低估值',
    expression: '(EPS增长率 > 20) AND (市盈率PE < 30) AND (净资产收益率ROE > 10)',
  },
  {
    name: 'RSI超卖',
    expression: '(RSI < 30) AND (成交量 > MA5成交量)',
  },
  {
    name: '突破新高',
    expression: '(股价 > MA60) AND (成交量 > MA5成交量 * 2)',
  },
  {
    name: '价值投资',
    expression: '(市盈率PE < 20) AND (市净率PB < 3) AND (净资产收益率ROE > 10) AND (股息率 > 2)',
  },
  {
    name: '成长股',
    expression: '(EPS增长率 > 30) AND (营收增长率 > 20) AND (毛利率 > 40)',
  },
];
