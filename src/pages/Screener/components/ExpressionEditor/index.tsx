/**
 * 表达式编辑器组件（简化版）
 */

import React, { useState } from 'react';
import { Input, Button, Space, Alert, Tag, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { EXPRESSION_EXAMPLES } from '../../hooks/useExpression';
import styles from './index.less';

const { TextArea } = Input;

interface ExpressionEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidate?: (expression: string) => Promise<{ valid: boolean; errors?: any[] }>;
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  value = '',
  onChange,
  onValidate,
}) => {
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; errors?: any[] } | null>(null);

  const handleValidate = async () => {
    if (!value.trim()) {
      setValidation({ valid: false, errors: [{ message: '表达式不能为空' }] });
      return;
    }

    setValidating(true);
    try {
      if (onValidate) {
        const result = await onValidate(value);
        setValidation(result);
      } else {
        // 简单的客户端验证
        const result = simpleValidate(value);
        setValidation(result);
      }
    } finally {
      setValidating(false);
    }
  };

  const simpleValidate = (expr: string): { valid: boolean; errors?: any[] } => {
    const errors: any[] = [];
    const warnings: any[] = [];

    // 1. 检查括号匹配
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    if (openCount !== closeCount) {
      errors.push({ 
        message: `括号不匹配：${openCount} 个左括号，${closeCount} 个右括号`,
        position: 'global'
      });
    }

    // 2. 检查空表达式
    if (!expr.trim()) {
      errors.push({ message: '表达式不能为空' });
    }

    // 3. 检查字段名
    const fieldPattern = /[a-zA-Z\u4e00-\u9fa5]+/g;
    const fields = expr.match(fieldPattern);
    if (!fields || fields.length === 0) {
      errors.push({ message: '表达式中未找到字段名' });
    }

    // 4. 检查运算符
    const operatorPattern = /[><]=?|[!=]=|AND|OR|NOT/gi;
    const operators = expr.match(operatorPattern);
    if (!operators || operators.length === 0) {
      warnings.push({ message: '未找到比较运算符或逻辑运算符' });
    }

    // 5. 检查数值格式
    const invalidNumbers = expr.match(/\d+[a-zA-Z]+/g);
    if (invalidNumbers && invalidNumbers.length > 0) {
      errors.push({ 
        message: `无效的数值格式: ${invalidNumbers.join(', ')}` 
      });
    }

    // 6. 检查连续的逻辑运算符
    if (/AND\s+AND|OR\s+OR|AND\s+OR\s+AND/i.test(expr)) {
      errors.push({ message: '存在连续或错误的逻辑运算符' });
    }

    // 7. 检查未闭合的引号
    const singleQuotes = (expr.match(/'/g) || []).length;
    const doubleQuotes = (expr.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      errors.push({ message: '存在未闭合的引号' });
    }

    // 8. 检查特殊字符
    const invalidChars = expr.match(/[^\w\s\u4e00-\u9fa5()<>=!&|+\-*/.,%'"]/g);
    if (invalidChars && invalidChars.length > 0) {
      warnings.push({ 
        message: `包含特殊字符: ${[...new Set(invalidChars)].join(', ')}` 
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  };

  const handleInsertExample = (example: string) => {
    const newValue = value ? `${value}\nAND ${example}` : example;
    onChange?.(newValue);
  };

  return (
    <div className={styles.expressionEditor}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 500 }}>表达式</span>
            <Button
              size="small"
              type="primary"
              onClick={handleValidate}
              loading={validating}
              icon={<CheckCircleOutlined />}
            >
              验证语法
            </Button>
          </div>
          <TextArea
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder="输入筛选表达式，例如：(市盈率PE < 30) AND (净资产收益率ROE > 10)"
            rows={6}
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        {validation && (
          <Alert
            message={validation.valid ? '语法正确' : '语法错误'}
            description={
              validation.errors && validation.errors.length > 0
                ? validation.errors.map((err, i) => (
                    <div key={i}>{err.message}</div>
                  ))
                : undefined
            }
            type={validation.valid ? 'success' : 'error'}
            icon={validation.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            showIcon
          />
        )}

        <Alert
          message="表达式语法说明"
          description={
            <div>
              <p>支持的运算符：</p>
              <ul style={{ marginBottom: 8 }}>
                <li>比较运算符：{'>'}, {'<'}, {'>'}{'>'}=, {'<'}=, =, !=</li>
                <li>逻辑运算符：AND, OR, NOT</li>
                <li>括号：( )</li>
              </ul>
              <p>示例：(市盈率PE {'<'} 30) AND (净资产收益率ROE {'>'} 10)</p>
            </div>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          closable
        />

        <Divider orientation="left" style={{ fontSize: 14 }}>
          示例表达式（点击插入）
        </Divider>

        <div className={styles.exampleTags}>
          {EXPRESSION_EXAMPLES.map(example => (
            <Tag
              key={example.name}
              color="blue"
              style={{ cursor: 'pointer', marginBottom: 8 }}
              onClick={() => handleInsertExample(example.expression)}
            >
              {example.name}
            </Tag>
          ))}
        </div>
      </Space>
    </div>
  );
};

export default ExpressionEditor;
