import React from 'react';
import { Form, Select, Checkbox } from 'antd';

const ColorPicker: React.FC<{ value?: string; onChange?: (value: string) => void }> = ({ 
  value = '#089981', 
  onChange 
}) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: 24,
        height: 24,
        border: '1px solid #d9d9d9',
        borderRadius: 2,
        cursor: 'pointer',
        padding: 0,
      }}
    />
  );
};

const SymbolSettings: React.FC = () => {
  return (
    <div>
      {/* K线图 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#131722' }}>
          K线图
        </div>
        
        {/* K线颜色基于前一收盘价 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['symbol', 'candleColorBasedOnPreviousClose']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>K线颜色基于前一收盘价</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 主体 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Form.Item 
            name={['symbol', 'bodyEnabled']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>主体</span>
            </Checkbox>
          </Form.Item>
          <Form.Item name={['symbol', 'bodyUpColor']} noStyle initialValue="#089981">
            <ColorPicker />
          </Form.Item>
          <Form.Item name={['symbol', 'bodyDownColor']} noStyle initialValue="#F23645">
            <ColorPicker />
          </Form.Item>
        </div>

        {/* 边框 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Form.Item 
            name={['symbol', 'borderEnabled']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>边框</span>
            </Checkbox>
          </Form.Item>
          <Form.Item name={['symbol', 'borderUpColor']} noStyle initialValue="#089981">
            <ColorPicker />
          </Form.Item>
          <Form.Item name={['symbol', 'borderDownColor']} noStyle initialValue="#F23645">
            <ColorPicker />
          </Form.Item>
        </div>

        {/* 影线 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Form.Item 
            name={['symbol', 'wickEnabled']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>影线</span>
            </Checkbox>
          </Form.Item>
          <Form.Item name={['symbol', 'wickUpColor']} noStyle initialValue="#089981">
            <ColorPicker />
          </Form.Item>
          <Form.Item name={['symbol', 'wickDownColor']} noStyle initialValue="#F23645">
            <ColorPicker />
          </Form.Item>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', margin: '20px 0' }} />

      {/* 数据修改 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#131722' }}>
          数据修改
        </div>
        
        {/* 时段 */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#787B86', minWidth: 40 }}>
            时段
          </div>
          <Form.Item 
            name={['symbol', 'session']} 
            noStyle 
            initialValue="regular"
          >
            <Select
              size="small"
              style={{ width: 180 }}
              options={[
                { value: 'regular', label: '常规交易时间' },
                { value: 'extended', label: '延长交易时段' },
              ]}
            />
          </Form.Item>
        </div>

        {/* 调整股息数据 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['symbol', 'adjustDividends']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>调整股息数据</span>
            </Checkbox>
          </Form.Item>
          <div style={{ marginLeft: 24, marginTop: 4 }}>
            <a
              href="https://cn.tradingview.com/chart/?solution=43000590597"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2962FF', fontSize: 11, textDecoration: 'none' }}
            >
              点击这里了解更多
            </a>
          </div>
        </div>

        {/* 精确度 */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#787B86', minWidth: 40 }}>
            精确度
          </div>
          <Form.Item 
            name={['symbol', 'precision']} 
            noStyle 
            initialValue="auto"
          >
            <Select
              size="small"
              style={{ width: 180 }}
              options={[
                { value: 'auto', label: '系统预设' },
                { value: '2', label: '2位小数' },
                { value: '3', label: '3位小数' },
                { value: '4', label: '4位小数' },
              ]}
            />
          </Form.Item>
        </div>

        {/* 时区 */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#787B86', minWidth: 40 }}>
            时区
          </div>
          <Form.Item 
            name={['symbol', 'timezone']} 
            noStyle 
            initialValue="Asia/Shanghai"
          >
            <Select
              size="small"
              style={{ width: 180 }}
              options={[
                { value: 'Asia/Shanghai', label: '(UTC+8) 上海' },
                { value: 'America/New_York', label: '(UTC-5) 纽约' },
                { value: 'Europe/London', label: '(UTC+0) 伦敦' },
                { value: 'Asia/Tokyo', label: '(UTC+9) 东京' },
                { value: 'Asia/Hong_Kong', label: '(UTC+8) 香港' },
              ]}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default SymbolSettings;
