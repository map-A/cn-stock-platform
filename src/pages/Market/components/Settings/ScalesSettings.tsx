import React, { useState } from 'react';
import { Select, Checkbox, Form, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';

interface ColorButtonProps {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
}

// 颜色按钮组件
const ColorButton: React.FC<ColorButtonProps> = ({ value = '#FFFFFF', onChange, disabled }) => {
  const [open, setOpen] = useState(false);

  const handleColorChange = (color: Color) => {
    const hexColor = color.toHexString();
    onChange?.(hexColor);
  };

  return (
    <ColorPicker
      value={value}
      onChange={handleColorChange}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <div
        style={{
          width: 24,
          height: 24,
          backgroundColor: value,
          border: '1px solid #d9d9d9',
          borderRadius: 2,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
    </ColorPicker>
  );
};

const ScalesSettings: React.FC = () => {
  return (
    <div>
      {/* 价格坐标 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>价格坐标</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 货币和单位 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>货币和单位</div>
            <Form.Item name={['scales', 'currencyUnit']} noStyle initialValue="hover">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'hover', label: '鼠标移动时可见' },
                  { value: 'always', label: '总是显示' },
                  { value: 'never', label: '总是隐藏' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 坐标模式 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>坐标模式（A和L）</div>
            <Form.Item name={['scales', 'scaleMode']} noStyle initialValue="hover">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'hover', label: '鼠标移动时可见' },
                  { value: 'always', label: '总是显示' },
                  { value: 'never', label: '总是隐藏' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 锁定价格对K线比例 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name={['scales', 'lockPriceRatio']} noStyle valuePropName="checked">
              <Checkbox style={{ fontSize: 12 }}>
                锁定价格对K线比例
              </Checkbox>
            </Form.Item>
            <input
              type="text"
              disabled
              defaultValue="0.0286997"
              style={{
                width: 180,
                height: 24,
                padding: '0 8px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                backgroundColor: '#f5f5f5',
                color: 'rgba(0, 0, 0, 0.25)',
                fontSize: 12,
              }}
            />
          </div>

          {/* 坐标放置 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>坐标放置</div>
            <Form.Item name={['scales', 'scalePlacement']} noStyle initialValue="auto">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'auto', label: '自动' },
                  { value: 'left', label: '左侧' },
                  { value: 'right', label: '右侧' },
                ]}
              />
            </Form.Item>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 价格标签和价格线 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>价格标签和价格线</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Form.Item name={['scales', 'noOverlappingLabels']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>无重叠标签</Checkbox>
            </Form.Item>
          </div>
          <div>
            <Form.Item name={['scales', 'plusButton']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>加号按钮</Checkbox>
            </Form.Item>
          </div>
          <div>
            <a
              href="https://cn.tradingview.com/chart/?solution=43000645256"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2962FF', fontSize: 12, textDecoration: 'none' }}
            >
              点击这里了解更多
            </a>
          </div>
          <div>
            <Form.Item name={['scales', 'barCountdown']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>当前K线结束倒计时</Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 商品代码 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 商品代码标题和显示选项 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#131722' }}>商品代码</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['scales', 'symbol', 'display']} noStyle initialValue={['value', 'line']}>
                <Select
                  size="small"
                  mode="multiple"
                  style={{ width: 150 }}
                  options={[
                    { value: 'name', label: '名称' },
                    { value: 'value', label: '值' },
                    { value: 'line', label: '线形图' },
                  ]}
                  placeholder="值, 线形图"
                />
              </Form.Item>
              <Form.Item name={['scales', 'symbol', 'color']} noStyle initialValue="#2962FF">
                <ColorButton />
              </Form.Item>
            </div>
          </div>

          {/* 显示模式 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86', visibility: 'hidden' }}>占位</div>
            <Form.Item name={['scales', 'symbol', 'mode']} noStyle initialValue="byScale">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'byScale', label: '根据坐标值' },
                  { value: 'lastValue', label: '最后值' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 前一天收盘 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>前一天收盘</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['scales', 'prevClose', 'show']} noStyle initialValue="hide">
                <Select
                  size="small"
                  style={{ width: 150 }}
                  options={[
                    { value: 'hide', label: '隐藏' },
                    { value: 'show', label: '显示' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['scales', 'prevClose', 'color']} noStyle initialValue="#787B86">
                <ColorButton disabled />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 其他价格线选项 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 指标和财务数据 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#131722' }}>指标和财务数据</div>
            <Form.Item name={['scales', 'indicators']} noStyle initialValue="line">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'line', label: '线形图' },
                  { value: 'none', label: '隐藏' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 盘前/盘后市场 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#131722' }}>盘前/盘后市场</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['scales', 'extendedHours', 'display']} noStyle initialValue={['value', 'line']}>
                <Select
                  size="small"
                  mode="multiple"
                  style={{ width: 150 }}
                  options={[
                    { value: 'name', label: '名称' },
                    { value: 'value', label: '值' },
                    { value: 'line', label: '线形图' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['scales', 'extendedHours', 'color']} noStyle initialValue="#2962FF">
                <ColorButton />
              </Form.Item>
              <Form.Item name={['scales', 'extendedHours', 'bgColor']} noStyle initialValue="#2962FF">
                <ColorButton disabled />
              </Form.Item>
            </div>
          </div>

          {/* 高点和低点 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#131722' }}>高点和低点</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['scales', 'highLow', 'show']} noStyle initialValue="hide">
                <Select
                  size="small"
                  style={{ width: 150 }}
                  options={[
                    { value: 'hide', label: '隐藏' },
                    { value: 'show', label: '显示' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['scales', 'highLow', 'color']} noStyle initialValue="#787B86">
                <ColorButton disabled />
              </Form.Item>
            </div>
          </div>

          {/* Bid和Ask */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#131722' }}>Bid和Ask</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['scales', 'bidAsk', 'show']} noStyle initialValue="hide">
                <Select
                  size="small"
                  style={{ width: 150 }}
                  options={[
                    { value: 'hide', label: '隐藏' },
                    { value: 'show', label: '显示' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['scales', 'bidAsk', 'bidColor']} noStyle initialValue="#F23645">
                <ColorButton disabled />
              </Form.Item>
              <Form.Item name={['scales', 'bidAsk', 'askColor']} noStyle initialValue="#089981">
                <ColorButton disabled />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 时间坐标 */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>时间坐标</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 标签上的星期几 */}
          <div>
            <Form.Item name={['scales', 'time', 'showDayOfWeek']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>标签上的星期几</Checkbox>
            </Form.Item>
          </div>

          {/* 日期格式 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>日期格式</div>
            <Form.Item name={['scales', 'time', 'dateFormat']} noStyle initialValue="monday1997">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'monday1997', label: '周一 1997-09-29' },
                  { value: 'ddmmyyyy', label: 'DD/MM/YYYY' },
                  { value: 'mmddyyyy', label: 'MM/DD/YYYY' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 时间小时格式 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>时间小时格式</div>
            <Form.Item name={['scales', 'time', 'timeFormat']} noStyle initialValue="24h">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: '24h', label: '24小时' },
                  { value: '12h', label: '12小时' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 改变周期时保存图表左边缘位置 */}
          <div>
            <Form.Item name={['scales', 'time', 'saveLeftEdge']} noStyle valuePropName="checked">
              <Checkbox style={{ fontSize: 12 }}>改变周期时保存图表左边缘位置</Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScalesSettings;
