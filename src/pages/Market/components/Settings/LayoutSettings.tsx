import React, { useState } from 'react';
import { Select, InputNumber, ColorPicker, Form } from 'antd';
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

const LayoutSettings: React.FC = () => {
  return (
    <div>
      {/* 图表基本样式 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>图表基本样式</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 背景 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>背景</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['layout', 'background', 'type']} noStyle initialValue="solid">
                <Select
                  size="small"
                  style={{ width: 150 }}
                  options={[
                    { value: 'solid', label: 'Solid' },
                    { value: 'gradient', label: '渐变' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['layout', 'background', 'color']} noStyle initialValue="#FFFFFF">
                <ColorButton />
              </Form.Item>
            </div>
          </div>

          {/* 网格线 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>网格线</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['layout', 'gridLines', 'type']} noStyle initialValue="both">
                <Select
                  size="small"
                  style={{ width: 150 }}
                  options={[
                    { value: 'both', label: '垂直和水平' },
                    { value: 'vertical', label: '仅垂直' },
                    { value: 'horizontal', label: '仅水平' },
                    { value: 'none', label: '无' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['layout', 'gridLines', 'verticalColor']} noStyle initialValue="#D1D4DC">
                <ColorButton />
              </Form.Item>
              <Form.Item name={['layout', 'gridLines', 'horizontalColor']} noStyle initialValue="#D1D4DC">
                <ColorButton />
              </Form.Item>
            </div>
          </div>

          {/* 十字线 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>十字线</div>
            <Form.Item name={['layout', 'crosshair', 'color']} noStyle initialValue="#9598A1">
              <ColorButton />
            </Form.Item>
          </div>

          {/* 水印 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>水印</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['layout', 'watermark', 'items']} noStyle initialValue={['replay']}>
                <Select
                  size="small"
                  mode="multiple"
                  style={{ width: 150 }}
                  options={[
                    { value: 'symbol', label: '商品代码' },
                    { value: 'period', label: '周期' },
                    { value: 'description', label: '描述' },
                    { value: 'replay', label: '回放模式' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['layout', 'watermark', 'color']} noStyle initialValue="#787B86">
                <ColorButton />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 坐标 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>坐标</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 文本 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>文本</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Form.Item name={['layout', 'scales', 'textColor']} noStyle initialValue="#787B86">
                <ColorButton />
              </Form.Item>
              <Form.Item name={['layout', 'scales', 'fontSize']} noStyle initialValue="12">
                <Select
                  size="small"
                  style={{ width: 70 }}
                  options={[
                    { value: '10', label: '10' },
                    { value: '11', label: '11' },
                    { value: '12', label: '12' },
                    { value: '13', label: '13' },
                    { value: '14', label: '14' },
                    { value: '16', label: '16' },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          {/* 线条 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>线条</div>
            <Form.Item name={['layout', 'scales', 'lineColor']} noStyle initialValue="#787B86">
              <ColorButton />
            </Form.Item>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 按钮 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>按钮</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 导航 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>导航</div>
            <Form.Item name={['layout', 'buttons', 'navigation']} noStyle initialValue="hover">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'hover', label: '鼠标移动时可见' },
                  { value: 'always', label: '始终可见' },
                  { value: 'never', label: '隐藏' },
                ]}
              />
            </Form.Item>
          </div>

          {/* 窗格 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>窗格</div>
            <Form.Item name={['layout', 'buttons', 'pane']} noStyle initialValue="hover">
              <Select
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: 'hover', label: '鼠标移动时可见' },
                  { value: 'always', label: '始终可见' },
                  { value: 'never', label: '隐藏' },
                ]}
              />
            </Form.Item>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 利润率 */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>利润率</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 顶部 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>顶部</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Form.Item name={['layout', 'margins', 'top']} noStyle initialValue={10}>
                <InputNumber
                  size="small"
                  min={0}
                  max={25}
                  style={{ width: 60 }}
                />
              </Form.Item>
              <span style={{ fontSize: 12, color: '#787B86' }}>%</span>
            </div>
          </div>

          {/* 底部 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>底部</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Form.Item name={['layout', 'margins', 'bottom']} noStyle initialValue={8}>
                <InputNumber
                  size="small"
                  min={0}
                  max={25}
                  style={{ width: 60 }}
                />
              </Form.Item>
              <span style={{ fontSize: 12, color: '#787B86' }}>%</span>
            </div>
          </div>

          {/* 右 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#787B86' }}>右</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Form.Item name={['layout', 'margins', 'right']} noStyle initialValue={10}>
                <InputNumber
                  size="small"
                  min={0}
                  max={50}
                  style={{ width: 60 }}
                />
              </Form.Item>
              <span style={{ fontSize: 12, color: '#787B86' }}>根K线</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutSettings;
