import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Checkbox,
  Select,
  Button,
  ColorPicker,
  Radio,
  Typography,
  message,
  Divider,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useSettingsStore } from '@/stores/modules/settings';
import { SymbolSettings, StatusLineSettings, ScalesSettings, LayoutSettings, TradingSettings } from './Settings';
import AlertSettings from './Settings/AlertSettings';
import EventSettings from './Settings/EventSettings';
import styles from './SettingsModal.module.less';

const { Text } = Typography;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('symbol');
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  // 当模态框打开时，同步当前设置到表单
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(settings);
    }
  }, [visible, settings, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      updateSettings(values);
      console.log('Settings saved:', values);
      message.success('设置已保存');
      onClose();
    });
  };

  const handleCancel = () => {
    form.setFieldsValue(settings); // 恢复到保存的设置
    onClose();
  };

  const handleReset = () => {
    Modal.confirm({
      title: '重置设置',
      content: '确定要将所有设置重置为默认值吗？',
      onOk: () => {
        resetSettings();
        form.setFieldsValue(settings);
        message.success('设置已重置为默认值');
      },
    });
  };

  const tabs = [
    { key: 'symbol', label: '商品代码' },
    { key: 'statusLine', label: '状态行' },
    { key: 'scales', label: '坐标和线条' },
    { key: 'appearance', label: '版面' },
    { key: 'trading', label: '交易' },
    { key: 'alerts', label: '警报' },
    { key: 'events', label: '事件' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'symbol':
        return <SymbolSettings />;
      
      case 'statusLine':
        return <StatusLineSettings />;
      
      case 'scales':
        return <ScalesSettings />;
      
      case 'appearance':
        return <LayoutSettings />;

      case 'trading':
        return <TradingSettings />;

      case 'alerts':
        return <AlertSettings />;

      case 'events':
        return <EventSettings />;

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className={styles.title}>
          <SettingOutlined />
          <span>设置</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width="50%"
      style={{ maxWidth: 800 }}
      className={styles.modal}
      footer={
        <div className={styles.footer}>
          <div className={styles.actions}>
            <Button onClick={handleReset} danger>重置为默认</Button>
          </div>
          <div className={styles.actions}>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleSave}>
              确认
            </Button>
          </div>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <div className={styles.bodyContent}>
          <div className={styles.sidebar}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.sidebarButton} ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.content}>{renderContent()}</div>
        </div>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
