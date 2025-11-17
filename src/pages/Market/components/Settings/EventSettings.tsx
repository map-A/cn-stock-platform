import React from 'react';
import { Checkbox, Select, Form } from 'antd';
import styles from './Settings.module.less';

const EventSettings: React.FC = () => {
  return (
    <div>
      {/* 事件 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>事件</div>
        
        <div className={styles.settingGroup}>
          {/* 观点 */}
          <div className={styles.settingRow}>
            <Form.Item name={['events', 'ideasEnabled']} noStyle valuePropName="checked" initialValue={false}>
              <Checkbox className={styles.checkbox}>观点</Checkbox>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.events?.ideasEnabled !== currentValues.events?.ideasEnabled
              }
            >
              {({ getFieldValue }) => {
                const isEnabled = getFieldValue(['events', 'ideasEnabled']);
                return (
                  <Form.Item name={['events', 'ideasType']} noStyle initialValue="all">
                    <Select
                      size="small"
                      className={styles.select}
                      disabled={!isEnabled}
                      options={[
                        { value: 'all', label: '所有观点' },
                        { value: 'following', label: '关注用户的观点' },
                        { value: 'mine', label: '只看我的观点' },
                      ]}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>

          {/* 了解更多链接 */}
          <div>
            <a
              href="https://cn.tradingview.com/chart/?solution=43000694285"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              点击这里了解更多
            </a>
          </div>

          {/* 股利 */}
          <div>
            <Form.Item name={['events', 'dividends']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>股利</Checkbox>
            </Form.Item>
          </div>

          {/* 拆分 */}
          <div>
            <Form.Item name={['events', 'splits']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>拆分</Checkbox>
            </Form.Item>
          </div>

          {/* 收益 */}
          <div>
            <Form.Item name={['events', 'earnings']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>收益</Checkbox>
            </Form.Item>
          </div>

          {/* 收益间隔 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name={['events', 'earningsInterval']} noStyle valuePropName="checked" initialValue={false}>
              <Checkbox style={{ fontSize: 12 }}>收益间隔</Checkbox>
            </Form.Item>
            <div style={{ width: 24, height: 24, backgroundColor: '#9C27B0', borderRadius: 2, border: '1px solid #d9d9d9' }} />
          </div>

          {/* 交易日间隔 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name={['events', 'tradingDayInterval']} noStyle valuePropName="checked" initialValue={false}>
              <Checkbox style={{ fontSize: 12 }}>交易日间隔</Checkbox>
            </Form.Item>
            <div style={{ width: 24, height: 24, backgroundColor: '#2962FF', borderRadius: 2, border: '1px solid #d9d9d9' }} />
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#E0E3EB', marginBottom: 24 }} />

      {/* 新闻 */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16, color: '#131722' }}>新闻</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 最新消息 */}
          <div>
            <Form.Item name={['events', 'latestNews']} noStyle valuePropName="checked" initialValue={true}>
              <Checkbox style={{ fontSize: 12 }}>最新消息</Checkbox>
            </Form.Item>
          </div>

          {/* 新闻通知 */}
          <div>
            <Form.Item name={['events', 'newsNotifications']} noStyle valuePropName="checked" initialValue={false}>
              <Checkbox style={{ fontSize: 12 }}>新闻通知</Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSettings;
