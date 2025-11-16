import React from 'react';
import { Form, Select, Checkbox, Slider } from 'antd';

const StatusLineSettings: React.FC = () => {
  return (
    <div>
      {/* 商品代码 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#131722' }}>
          商品代码
        </div>
        
        {/* Logo */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'logo']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>Logo</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 标题 + 描述下拉框在右侧 */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Form.Item 
            name={['statusLine', 'title']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>标题</span>
            </Checkbox>
          </Form.Item>
          
          <Form.Item 
            name={['statusLine', 'description']} 
            noStyle 
            initialValue="full"
          >
            <Select
              size="small"
              style={{ width: 140 }}
              options={[
                { value: 'full', label: '描述' },
                { value: 'none', label: '无' },
              ]}
            />
          </Form.Item>
        </div>

        {/* 图表值 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'chartValues']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>图表值</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* K线变化值 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'barChangeValues']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>K线变化值</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 成交量 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'volume']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>成交量</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 最后一天变化值 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'lastDayChangeValues']} 
            noStyle 
            valuePropName="checked" 
            initialValue={false}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>最后一天变化值</span>
            </Checkbox>
          </Form.Item>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', margin: '20px 0' }} />

      {/* 指标 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#131722' }}>
          指标
        </div>
        
        {/* 标题（父级） */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'indicatorTitle']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>标题</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 输入（标题的子级，缩进） */}
        <div style={{ marginBottom: 12, marginLeft: 24 }}>
          <Form.Item 
            name={['statusLine', 'indicatorInput']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>输入</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 数值 */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item 
            name={['statusLine', 'indicatorValues']} 
            noStyle 
            valuePropName="checked" 
            initialValue={true}
          >
            <Checkbox>
              <span style={{ fontSize: 12, color: '#131722' }}>数值</span>
            </Checkbox>
          </Form.Item>
        </div>

        {/* 背景 + 滑动条在右侧 */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.statusLine?.indicatorBackgroundEnabled !== currentValues.statusLine?.indicatorBackgroundEnabled
        }>
          {({ getFieldValue }) => {
            const enabled = getFieldValue(['statusLine', 'indicatorBackgroundEnabled']);
            return (
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Form.Item 
                  name={['statusLine', 'indicatorBackgroundEnabled']} 
                  noStyle 
                  valuePropName="checked" 
                  initialValue={true}
                >
                  <Checkbox>
                    <span style={{ fontSize: 12, color: '#131722' }}>背景</span>
                  </Checkbox>
                </Form.Item>
                
                {/* 背景透明度滑动选择器在右侧 */}
                {enabled && (
                  <Form.Item
                    name={['statusLine', 'backgroundOpacity']}
                    noStyle
                    initialValue={90}
                  >
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      style={{ width: 140, margin: 0 }}
                    />
                  </Form.Item>
                )}
              </div>
            );
          }}
        </Form.Item>
      </div>
    </div>
  );
};

export default StatusLineSettings;
