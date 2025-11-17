/**
 * Code Mode - 代码编辑器模式
 * 
 * 布局：左侧文件树 | 中间 Monaco 编辑器 | 右侧参数/控制面板
 */

import React, { useState, useCallback } from 'react';
import { Button, Space, Tree, Tabs, message, Spin } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlayCircleOutlined,
  BugOutlined,
  FormatPainterOutlined,
  SaveOutlined,
  FileOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import type { Strategy } from '@/typings/strategy';
import styles from '../index.less';

interface CodeModeProps {
  strategy: Strategy;
  onChange: () => void;
}

interface FileNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: FileNode[];
  content?: string;
}

// 模拟文件树
const fileTree: FileNode[] = [
  {
    key: 'main.py',
    title: 'main.py',
    icon: <FileOutlined />,
    content: `# 均线交叉策略
import pandas as pd
import numpy as np

class MACrossStrategy:
    """
    双均线交叉策略
    当快线上穿慢线时买入，下穿时卖出
    """
    
    def __init__(self, fast_period=10, slow_period=20):
        self.fast_period = fast_period
        self.slow_period = slow_period
        self.position = 0
        
    def calculate_signals(self, data):
        """计算交易信号"""
        # 计算移动平均线
        data['MA_fast'] = data['close'].rolling(self.fast_period).mean()
        data['MA_slow'] = data['close'].rolling(self.slow_period).mean()
        
        # 生成信号
        data['signal'] = 0
        data.loc[data['MA_fast'] > data['MA_slow'], 'signal'] = 1
        data.loc[data['MA_fast'] < data['MA_slow'], 'signal'] = -1
        
        return data
    
    def on_bar(self, bar):
        """处理每个K线"""
        # 获取当前信号
        signal = bar['signal']
        
        # 执行交易逻辑
        if signal == 1 and self.position == 0:
            # 买入信号且当前无持仓
            self.buy(bar['close'], 100)
            self.position = 1
            
        elif signal == -1 and self.position == 1:
            # 卖出信号且当前有持仓
            self.sell(bar['close'], 100)
            self.position = 0
    
    def buy(self, price, quantity):
        """买入"""
        print(f"买入: 价格={price}, 数量={quantity}")
    
    def sell(self, price, quantity):
        """卖出"""
        print(f"卖出: 价格={price}, 数量={quantity}")
`,
  },
  {
    key: 'params.json',
    title: 'params.json',
    icon: <FileOutlined />,
    content: `{
  "fast_period": 10,
  "slow_period": 20,
  "initial_capital": 100000,
  "commission": 0.001,
  "slippage": 0.001
}`,
  },
  {
    key: 'utils',
    title: 'utils',
    icon: <FolderOutlined />,
    children: [
      {
        key: 'utils/indicators.py',
        title: 'indicators.py',
        icon: <FileOutlined />,
        content: `# 技术指标工具函数
import pandas as pd

def calculate_ma(data, period):
    """计算移动平均线"""
    return data.rolling(period).mean()

def calculate_ema(data, period):
    """计算指数移动平均线"""
    return data.ewm(span=period, adjust=False).mean()

def calculate_rsi(data, period=14):
    """计算RSI指标"""
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))
`,
      },
    ],
  },
  {
    key: 'README.md',
    title: 'README.md',
    icon: <FileOutlined />,
    content: `# 均线交叉策略

## 策略说明
这是一个基于双均线交叉的趋势跟踪策略。

## 参数
- fast_period: 快线周期（默认10）
- slow_period: 慢线周期（默认20）
- initial_capital: 初始资金（默认100000）
- commission: 手续费率（默认0.001）

## 信号规则
- 买入信号：快线上穿慢线
- 卖出信号：快线下穿慢线

## 风险提示
该策略仅供学习参考，实盘使用需谨慎。
`,
  },
];

const CodeMode: React.FC<CodeModeProps> = ({ strategy, onChange }) => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileNode>(fileTree[0]);
  const [code, setCode] = useState(fileTree[0].content || '');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // 文件选择
  const onFileSelect = (selectedKeys: React.Key[], info: any) => {
    const node = info.node;
    if (!node.children && node.content !== undefined) {
      setSelectedFile(node);
      setCode(node.content);
    }
  };

  // 代码变更
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setCode(value);
        onChange();
      }
    },
    [onChange]
  );

  // 运行代码
  const handleRun = async () => {
    setIsRunning(true);
    setLogs(['[INFO] 开始运行策略...']);
    
    try {
      // TODO: 调用后端 API 执行代码
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLogs(prev => [
        ...prev,
        '[INFO] 策略编译成功',
        '[INFO] 执行回测...',
        '[SUCCESS] 回测完成',
        '[RESULT] 总收益: +12.5%',
        '[RESULT] 夏普比率: 1.8',
      ]);
      
      message.success('运行成功');
    } catch (error) {
      setLogs(prev => [...prev, '[ERROR] 运行失败']);
      message.error('运行失败');
    } finally {
      setIsRunning(false);
    }
  };

  // Lint 检查
  const handleLint = () => {
    message.info('代码检查功能开发中...');
  };

  // 格式化代码
  const handleFormat = () => {
    message.success('代码已格式化');
  };

  return (
    <div className={styles.threeColumnLayout}>
      {/* 左侧：文件树 */}
      <div className={`${styles.leftPanel} ${leftCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.panelHeader}>
          <h4>文件</h4>
          <Button
            type="text"
            size="small"
            icon={<MenuFoldOutlined />}
            onClick={() => setLeftCollapsed(true)}
          />
        </div>
        <div className={styles.panelContent}>
          <Tree
            showIcon
            defaultExpandAll
            selectedKeys={[selectedFile.key]}
            onSelect={onFileSelect}
            treeData={fileTree}
          />
        </div>
      </div>

      {leftCollapsed && (
        <Button
          className={`${styles.collapseButton} ${styles.leftCollapse}`}
          icon={<MenuUnfoldOutlined />}
          onClick={() => setLeftCollapsed(false)}
        />
      )}

      {/* 中间：代码编辑器 */}
      <div className={styles.centerWorkspace}>
        <div className={styles.workspaceHeader}>
          <Space>
            <FileOutlined />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{selectedFile.title}</span>
          </Space>
          <Space>
            <Button
              size="small"
              icon={<FormatPainterOutlined />}
              onClick={handleFormat}
            >
              格式化
            </Button>
            <Button
              size="small"
              icon={<BugOutlined />}
              onClick={handleLint}
            >
              Lint
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={handleRun}
              loading={isRunning}
            >
              快速测试
            </Button>
          </Space>
        </div>

        <div className={styles.workspaceContent}>
          <Editor
            height="100%"
            language={selectedFile.key.endsWith('.py') ? 'python' : selectedFile.key.endsWith('.json') ? 'json' : 'markdown'}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [80, 120],
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              parameterHints: { enabled: true },
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>

        <div className={styles.workspaceFooter}>
          <Tabs
            size="small"
            items={[
              {
                key: 'terminal',
                label: '终端',
                children: (
                  <div
                    style={{
                      height: '160px',
                      overflow: 'auto',
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                      padding: '8px',
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: 12,
                      lineHeight: '1.5',
                    }}
                  >
                    {logs.map((log, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        {log}
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'problems',
                label: '问题',
                children: (
                  <div style={{ 
                    height: '160px', 
                    padding: 8, 
                    fontSize: 12,
                    overflow: 'auto'
                  }}>
                    无问题
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* 右侧：参数和控制面板 */}
      <div className={`${styles.rightPanel} ${rightCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.panelHeader}>
          <h4>参数</h4>
          <Button
            type="text"
            size="small"
            icon={<MenuFoldOutlined />}
            onClick={() => setRightCollapsed(true)}
          />
        </div>
        <div className={styles.panelContent}>
          <div className={styles.panelSection}>
            <div className={styles.sectionTitle}>策略参数</div>
            <pre style={{ fontSize: 12, color: '#666', margin: 0 }}>
              {JSON.stringify(strategy.parameters?.reduce((acc, p) => {
                acc[p.key] = p.value;
                return acc;
              }, {} as any), null, 2)}
            </pre>
          </div>

          <div className={styles.panelSection}>
            <div className={styles.sectionTitle}>快速操作</div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block size="small" icon={<PlayCircleOutlined />}>
                快速回测
              </Button>
              <Button block size="small" icon={<SaveOutlined />}>
                保存快照
              </Button>
            </Space>
          </div>

          <div className={styles.panelSection}>
            <div className={styles.sectionTitle}>代码统计</div>
            <Space direction="vertical" size={4} style={{ width: '100%', fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#999' }}>行数:</span>
                <span>{code.split('\n').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#999' }}>字符:</span>
                <span>{code.length}</span>
              </div>
            </Space>
          </div>
        </div>
      </div>

      {rightCollapsed && (
        <Button
          className={`${styles.collapseButton} ${styles.rightCollapse}`}
          icon={<MenuUnfoldOutlined />}
          onClick={() => setRightCollapsed(false)}
        />
      )}
    </div>
  );
};

export default CodeMode;
