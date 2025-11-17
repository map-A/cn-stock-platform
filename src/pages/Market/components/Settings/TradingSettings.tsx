import React, { useState } from 'react';
import { Form, Checkbox, Select, Slider } from 'antd';
import styles from './Settings.module.less';

const TradingSettings: React.FC = () => {
  const [executionSoundEnabled, setExecutionSoundEnabled] = useState(false);

  return (
    <div>
      {/* 普通 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>普通</div>
        
        {/* 买/卖按钮 */}
        <div className={styles.settingRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Form.Item 
            name={['trading', 'buySellButtons']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span className={styles.label}>买/卖按钮</span>
            </Checkbox>
          </Form.Item>
          <div className={styles.helperText}>
            图表上直接显示买入和卖出按钮
          </div>
        </div>

        {/* 一键交易 */}
        <div className={styles.settingRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <Form.Item 
              name={['trading', 'oneClickTrading']} 
              noStyle 
              valuePropName="checked" 
              initialValue={false}
            >
              <Checkbox>
                <span className={styles.label}>一键交易</span>
              </Checkbox>
            </Form.Item>
            <a
              href="https://cn.tradingview.com/chart/?solution=43000480920"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              style={{ marginLeft: 4 }}
            >
              一键交易
            </a>
          </div>
          <div style={{ fontSize: 11, color: '#787B86', marginLeft: 24, marginTop: 2 }}>
            无需确认即可立即下单、编辑、取消订单或平仓
          </div>
        </div>

        {/* 执行声音 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['trading', 'executionSound']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox onChange={(e) => setExecutionSoundEnabled(e.target.checked)}>
              <span style={{ fontSize: 12, color: '#131722' }}>执行声音</span>
            </Checkbox>
          </Form.Item>
          
          {executionSoundEnabled && (
            <div style={{ marginLeft: 24, marginTop: 8 }}>
              <Form.Item 
                name={['trading', 'executionSoundVolume']} 
                noStyle 
                initialValue={0.5}
              >
                <Slider
                  style={{ width: '100%', marginBottom: 4 }}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Form.Item>
              <div style={{ fontSize: 11, color: '#787B86', marginBottom: 4 }}>旋律</div>
              <Form.Item 
                name={['trading', 'executionSoundType']} 
                noStyle 
                initialValue="alarm"
              >
                <Select
                  size="small"
                  style={{ width: '100%' }}
                  options={[
                    { value: 'alarm', label: '闹铃' },
                  ]}
                />
              </Form.Item>
            </div>
          )}
        </div>

        {/* 仅显示拒绝通知 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['trading', 'showRejectNotificationsOnly']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>仅显示拒绝通知</span>
            </Checkbox>
          </Form.Item>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', margin: '20px 0' }} />

      {/* 外观 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#131722' }}>
          外观
        </div>
        
        {/* 仓位和订单 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['trading', 'positionsAndOrders']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>仓位和订单</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 子选项区域 - 缩进显示 */}
        <div style={{ marginLeft: 24 }}>
          {/* 反向仓位按钮 */}
          <div style={{ marginBottom: 12 }}>
            <Form.Item 
              name={['trading', 'reversePositionButton']} 
              noStyle 
              valuePropName="checked" 
              initialValue={true}
            >
              <Checkbox>
                <span style={{ fontSize: 12, color: '#131722' }}>反向仓位按钮</span>
              </Checkbox>
            </Form.Item>
            <div style={{ fontSize: 11, color: '#787B86', marginLeft: 24, marginTop: 2 }}>
              在图表上的未平仓位旁边添加反转按钮
            </div>
          </div>

          {/* 盈利和亏损值 */}
          <div style={{ marginBottom: 12 }}>
            <div>
              <Form.Item 
                name={['trading', 'profitAndLossValues']} 
                noStyle 
                valuePropName="checked" 
                initialValue={true}
              >
                <Checkbox>
                  <span style={{ fontSize: 12, color: '#131722' }}>盈利和亏损值</span>
                </Checkbox>
              </Form.Item>
              <a
                href="https://cn.tradingview.com/chart/?solution=43000761181"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2962FF', fontSize: 11, marginLeft: 4, textDecoration: 'none' }}
              >
                点击这里了解更多
              </a>
            </div>
          </div>

          {/* 持仓 */}
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Form.Item 
              name={['trading', 'positions']} 
              noStyle 
              valuePropName="checked" 
              initialValue={true}
            >
              <Checkbox>
                <span style={{ fontSize: 12, color: '#131722' }}>持仓</span>
              </Checkbox>
            </Form.Item>
            <Form.Item 
              name={['trading', 'positionsUnit']} 
              noStyle 
              initialValue="currency"
            >
              <Select
                size="small"
                style={{ width: 100 }}
                options={[
                  { value: 'currency', label: '资金' },
                  { value: 'ticks', label: 'ticks' },
                  { value: 'percent', label: '%' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 包围单 */}
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Form.Item 
              name={['trading', 'brackets']} 
              noStyle 
              valuePropName="checked" 
              initialValue={true}
            >
              <Checkbox>
                <span style={{ fontSize: 12, color: '#131722' }}>包围单</span>
              </Checkbox>
            </Form.Item>
            <Form.Item 
              name={['trading', 'bracketsUnit']} 
              noStyle 
              initialValue="currency"
            >
              <Select
                size="small"
                style={{ width: 100 }}
                options={[
                  { value: 'currency', label: '资金' },
                  { value: 'ticks', label: 'ticks' },
                  { value: 'percent', label: '%' },
                ]}
              />
            </Form.Item>
          </div>

          {/* Execution marks */}
          <div style={{ marginBottom: 12 }}>
            <Form.Item 
              name={['trading', 'executionMarks']} 
              noStyle 
              valuePropName="checked" 
              initialValue={true}
            >
              <Checkbox>
                <span style={{ fontSize: 12, color: '#131722' }}>Execution marks</span>
              </Checkbox>
            </Form.Item>
          </div>

          {/* Execution labels - 再次缩进 */}
          <div style={{ marginLeft: 24, marginBottom: 12 }}>
            <Form.Item 
              name={['trading', 'executionLabels']} 
              noStyle 
              valuePropName="checked" 
              initialValue={false}
            >
              <Checkbox>
                <span style={{ fontSize: 12, color: '#131722' }}>Execution labels</span>
              </Checkbox>
            </Form.Item>
          </div>

          {/* 延伸价格线至整个图表宽度 */}
          <div style={{ marginBottom: 12 }}>
            <Form.Item 
              name={['trading', 'extendPriceLinesToChartWidth']} 
              noStyle 
              valuePropName="checked" 
              initialValue={true}
            >
              <Checkbox>
                <span style={{ fontSize: 12, color: '#131722' }}>延伸价格线至整个图表宽度</span>
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        {/* 订单和仓位对齐 */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#787B86' }}>
            订单和仓位对齐
          </div>
          <Form.Item 
            name={['trading', 'orderAndPositionAlignment']} 
            noStyle 
            initialValue="right"
          >
            <Select
              size="small"
              style={{ width: 100 }}
              options={[
                { value: 'left', label: '左' },
                { value: 'center', label: '中心' },
                { value: 'right', label: '右' },
              ]}
            />
          </Form.Item>
        </div>

        {/* 屏幕截图中的订单、执行和仓位 */}
        <div>
          <Form.Item 
            name={['trading', 'ordersExecutionsPositionsInScreenshot']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>
                屏幕截图中的订单、执行和仓位
              </span>
            </Checkbox>
          </Form.Item>
          <div style={{ fontSize: 11, color: '#787B86', marginLeft: 24, marginTop: 2 }}>
            在图表截图中显示您的交易
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSettings;
