import React from 'react';
import { Checkbox, Slider, Form } from 'antd';
import styles from './Settings.module.less';

const AlertSettings: React.FC = () => {
  return (
    <div>
      {/* 图表线可见性 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>图表线可见性</div>
        
        <div className={styles.settingGroup}>
          {/* 警报线 */}
          <div className={styles.settingRow}>
            <Form.Item name={['alert', 'alertLines']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox className={styles.checkbox}>警报线</Checkbox>
            </Form.Item>
            <div className={styles.colorBox} style={{ backgroundColor: '#2962FF' }} />
          </div>

          {/* 仅活动警报 */}
          <div>
            <Form.Item name={['alert', 'activeAlertsOnly']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox className={styles.checkbox}>仅活动警报</Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* 通知 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>通知</div>
        
        <div className={styles.settingGroup}>
          {/* 警报音量 */}
          <div className={`${styles.settingRow} ${styles.withGap24}`}>
            <Form.Item name={['alert', 'alertSoundEnabled']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox className={styles.checkbox}>警报音量</Checkbox>
            </Form.Item>
            <div className={styles.slider}>
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
