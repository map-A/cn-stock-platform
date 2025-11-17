/**
 * 规则列表转表达式工具
 */

import type { FilterCondition, ComparisonOperator } from '../types';

/**
 * 将比较运算符转换为表达式符号
 */
const operatorToSymbol = (operator: ComparisonOperator): string => {
  const map: Record<ComparisonOperator, string> = {
    gt: '>',
    lt: '<',
    gte: '>=',
    lte: '<=',
    eq: '==',
    neq: '!=',
    between: 'BETWEEN',
    in: 'IN',
  };
  return map[operator] || operator;
};

/**
 * 格式化字段名（添加中文别名）
 */
const formatFieldName = (field: string): string => {
  const fieldMap: Record<string, string> = {
    peRatio: '市盈率PE',
    pbRatio: '市净率PB',
    roe: '净资产收益率ROE',
    eps: '每股收益EPS',
    marketCap: '市值',
    price: '价格',
    volume: '成交量',
    changePercent: '涨跌幅',
    ma5: 'MA5',
    ma10: 'MA10',
    ma20: 'MA20',
    rsi: 'RSI',
    macd: 'MACD',
    grossProfitMargin: '毛利率',
    netProfitMargin: '净利率',
    revenueGrowth: '营收增长率',
    epsGrowth: 'EPS增长率',
    debtRatio: '资产负债率',
    dividendYield: '股息率',
  };
  return fieldMap[field] || field;
};

/**
 * 格式化值
 */
const formatValue = (value: any, operator: ComparisonOperator): string => {
  if (operator === 'between' && Array.isArray(value)) {
    return `[${value[0]}, ${value[1]}]`;
  }
  if (operator === 'in' && Array.isArray(value)) {
    return `[${value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`;
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return String(value);
};

/**
 * 单个条件转表达式
 */
export const conditionToExpression = (condition: FilterCondition): string => {
  const field = formatFieldName(condition.field);
  const operator = operatorToSymbol(condition.operator);
  const value = formatValue(condition.value, condition.operator);

  if (condition.operator === 'between') {
    return `(${field} >= ${condition.value[0]} AND ${field} <= ${condition.value[1]})`;
  }

  if (condition.operator === 'in') {
    return `${field} IN ${value}`;
  }

  return `${field} ${operator} ${value}`;
};

/**
 * 规则列表转表达式
 */
export const rulesToExpression = (conditions: FilterCondition[]): string => {
  if (conditions.length === 0) {
    return '';
  }

  if (conditions.length === 1) {
    return conditionToExpression(conditions[0]);
  }

  let expression = '';
  
  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const condExpr = conditionToExpression(condition);
    
    if (i === 0) {
      expression = condExpr;
    } else {
      const logicalOp = conditions[i - 1].logicalOperator || 'AND';
      expression += `\n${logicalOp} ${condExpr}`;
    }
  }

  return expression;
};

/**
 * 优化表达式格式（添加适当的括号和换行）
 */
export const formatExpression = (expression: string): string => {
  // 在 AND/OR 前添加换行
  let formatted = expression.replace(/\s+(AND|OR)\s+/g, '\n$1 ');
  
  // 添加缩进
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const indented = lines.map(line => {
    const trimmed = line.trim();
    
    // 计算缩进
    const openCount = (trimmed.match(/\(/g) || []).length;
    const closeCount = (trimmed.match(/\)/g) || []).length;
    
    if (closeCount > openCount) {
      indentLevel = Math.max(0, indentLevel - (closeCount - openCount));
    }
    
    const result = '  '.repeat(indentLevel) + trimmed;
    
    if (openCount > closeCount) {
      indentLevel += openCount - closeCount;
    }
    
    return result;
  });
  
  return indented.join('\n');
};

/**
 * 简单的表达式解析（将表达式转回规则列表）
 */
export const expressionToRules = (expression: string): FilterCondition[] => {
  const rules: FilterCondition[] = [];
  
  // 简化版本：按 AND/OR 分割
  const parts = expression.split(/\s+(AND|OR)\s+/i);
  
  let currentLogicalOp: 'AND' | 'OR' = 'AND';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    
    // 跳过逻辑运算符本身
    if (part.toUpperCase() === 'AND' || part.toUpperCase() === 'OR') {
      currentLogicalOp = part.toUpperCase() as 'AND' | 'OR';
      continue;
    }
    
    // 尝试解析条件
    const condition = parseCondition(part);
    if (condition) {
      if (rules.length > 0) {
        rules[rules.length - 1].logicalOperator = currentLogicalOp;
      }
      rules.push(condition);
    }
  }
  
  return rules;
};

/**
 * 解析单个条件
 */
const parseCondition = (expr: string): FilterCondition | null => {
  // 移除外层括号
  expr = expr.replace(/^\(|\)$/g, '').trim();
  
  // 匹配模式: field operator value
  const patterns = [
    /(.+?)\s*(>=|<=|>|<|==|!=)\s*(.+)/,
    /(.+?)\s+IN\s+\[(.+?)\]/i,
    /(.+?)\s+BETWEEN\s+\[(.+?),\s*(.+?)\]/i,
  ];
  
  for (const pattern of patterns) {
    const match = expr.match(pattern);
    if (match) {
      const field = match[1].trim();
      let operator: ComparisonOperator;
      let value: any;
      
      if (expr.includes('BETWEEN')) {
        operator = 'between';
        value = [parseFloat(match[2]), parseFloat(match[3])];
      } else if (expr.includes('IN')) {
        operator = 'in';
        value = match[2].split(',').map(v => v.trim().replace(/['"]/g, ''));
      } else {
        const opMap: Record<string, ComparisonOperator> = {
          '>': 'gt',
          '<': 'lt',
          '>=': 'gte',
          '<=': 'lte',
          '==': 'eq',
          '!=': 'neq',
        };
        operator = opMap[match[2]] || 'eq';
        value = match[3].trim().replace(/['"]/g, '');
        
        // 尝试转换为数字
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          value = numValue;
        }
      }
      
      return {
        id: `rule_${Date.now()}_${Math.random()}`,
        field: reverseFieldName(field),
        operator,
        value,
      };
    }
  }
  
  return null;
};

/**
 * 反向映射字段名
 */
const reverseFieldName = (displayName: string): string => {
  const reverseMap: Record<string, string> = {
    '市盈率PE': 'peRatio',
    '市净率PB': 'pbRatio',
    '净资产收益率ROE': 'roe',
    '每股收益EPS': 'eps',
    '市值': 'marketCap',
    '价格': 'price',
    '成交量': 'volume',
    '涨跌幅': 'changePercent',
    'MA5': 'ma5',
    'MA10': 'ma10',
    'MA20': 'ma20',
    'RSI': 'rsi',
    'MACD': 'macd',
    '毛利率': 'grossProfitMargin',
    '净利率': 'netProfitMargin',
    '营收增长率': 'revenueGrowth',
    'EPS增长率': 'epsGrowth',
    '资产负债率': 'debtRatio',
    '股息率': 'dividendYield',
  };
  
  return reverseMap[displayName] || displayName;
};
