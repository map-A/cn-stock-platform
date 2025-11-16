import React from 'react';
import { Checkbox, Slider, Form } from 'antd';

const AlertSettings: React.FC = () => {
  return (
    <div>
      {/* 图表线可见性 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>图表线可见性</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 警报线 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name={['alert', 'alertLines']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>警报线</Checkbox>
            </Form.Item>
            <div style={{ width: 24, height: 24, backgroundColor: '#2962FF', borderRadius: 2, border: '1px solid #d9d9d9' }} />
          </div>

          {/* 仅活动警报 */}
          <div>
            <Form.Item name={['alert', 'activeAlertsOnly']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>仅活动警报</Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 通知 */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>通知</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 警报音量 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <Form.Item name={['alert', 'alertSoundEnabled']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>警报音量</Checkbox>
            </Form.Item>
            <div style={{ width: 200 }}>
              <Form.Item name={['alert', 'alertVolume']} noStyle initialValue={50}>
                <Slider
                  min={0}
                  max={100}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
              </Form.Item>
            </div>
          </div>

          {/* 自动隐藏弹窗 */}
          <div>
            <Form.Item name={['alert', 'autoHidePopup']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>自动隐藏弹窗</Checkbox>
            </Form.Item>
          </div>

          {/* 了解更多链接 */}
          <div>
            <a
              href="https://cn.tradingview.com/chart/?solution=43000737982"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2962FF', fontSize: 12, textDecoration: 'none' }}
            >
              点击这里了解更多
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;
