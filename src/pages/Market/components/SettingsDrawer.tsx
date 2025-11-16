import React from 'react';
import { Drawer, Form, Select, Switch, Radio, Divider, Space } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '16px',
    color: token.colorText,
  },
}));

interface SettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ visible, onClose }) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();

  return (
    <Drawer
      title="设置"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          theme: 'light',
          language: 'zh-CN',
          timezone: 'UTC+8',
          dateFormat: 'YYYY-MM-DD',
          priceFormat: 'auto',
          volumeFormat: 'millions',
          showGrid: true,
          showCrosshair: true,
          showVolume: true,
          showMACD: false,
          autoSave: true,
          soundAlerts: true,
        }}
      >
        <div className={styles.section}>
          <div className={styles.sectionTitle}>外观</div>
          <Form.Item label="主题" name="theme">
            <Radio.Group>
              <Radio value="light">浅色</Radio>
              <Radio value="dark">深色</Radio>
              <Radio value="auto">跟随系统</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item label="语言" name="language">
            <Select>
              <Select.Option value="zh-CN">简体中文</Select.Option>
              <Select.Option value="zh-TW">繁體中文</Select.Option>
              <Select.Option value="en-US">English</Select.Option>
              <Select.Option value="ja-JP">日本語</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        <div className={styles.section}>
          <div className={styles.sectionTitle}>时间和日期</div>
          <Form.Item label="时区" name="timezone">
            <Select>
              <Select.Option value="UTC+8">UTC+8 北京时间</Select.Option>
              <Select.Option value="UTC">UTC 协调世界时</Select.Option>
              <Select.Option value="EST">EST 美国东部时间</Select.Option>
              <Select.Option value="CET">CET 欧洲中部时间</Select.Option>
              <Select.Option value="JST">JST 日本标准时间</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="日期格式" name="dateFormat">
            <Select>
              <Select.Option value="YYYY-MM-DD">2025-01-12</Select.Option>
              <Select.Option value="DD/MM/YYYY">12/01/2025</Select.Option>
              <Select.Option value="MM/DD/YYYY">01/12/2025</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        <div className={styles.section}>
          <div className={styles.sectionTitle}>数据格式</div>
          <Form.Item label="价格格式" name="priceFormat">
            <Select>
              <Select.Option value="auto">自动</Select.Option>
              <Select.Option value="2">两位小数</Select.Option>
              <Select.Option value="4">四位小数</Select.Option>
              <Select.Option value="6">六位小数</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="成交量单位" name="volumeFormat">
            <Select>
              <Select.Option value="millions">百万 (M)</Select.Option>
              <Select.Option value="thousands">千 (K)</Select.Option>
              <Select.Option value="actual">实际数值</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        <div className={styles.section}>
          <div className={styles.sectionTitle}>图表显示</div>
          <Form.Item label="显示网格" name="showGrid" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item label="显示十字线" name="showCrosshair" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item label="显示成交量" name="showVolume" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item label="显示MACD" name="showMACD" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Divider />

        <div className={styles.section}>
          <div className={styles.sectionTitle}>功能</div>
          <Form.Item label="自动保存布局" name="autoSave" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item label="警报声音提醒" name="soundAlerts" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default SettingsDrawer;
