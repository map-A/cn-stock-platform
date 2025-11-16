import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Checkbox,
  Radio,
  Typography,
  message,
  Row,
  Col,
  Space,
} from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const { Text } = Typography;
const { TextArea } = Input;

const useStyles = createStyles(({ token }) => ({
  modal: {
    '.ant-modal-header': {
      padding: '16px 24px',
      borderBottom: `1px solid ${token.colorBorder}`,
      marginBottom: 0,
    },
    '.ant-modal-body': {
      padding: 0,
      maxHeight: '70vh',
      overflowY: 'auto',
    },
    '.ant-modal-footer': {
      padding: '12px 24px',
      marginTop: 0,
      borderTop: `1px solid ${token.colorBorder}`,
    },
  },
  tabs: {
    '.ant-tabs-nav': {
      padding: '0 24px',
      margin: 0,
      background: token.colorBgContainer,
    },
    '.ant-tabs-content': {
      padding: '24px',
    },
  },
  formItem: {
    marginBottom: '16px',
    '.ant-form-item-label': {
      padding: '0 0 4px',
      label: {
        fontSize: '13px',
        fontWeight: 500,
      },
    },
  },
  conditionRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '12px',
  },
  helperText: {
    fontSize: '12px',
    color: token.colorTextSecondary,
    lineHeight: '18px',
    marginTop: '4px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  subInput: {
    marginTop: '8px',
    marginLeft: '24px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '12px',
    marginTop: '16px',
  },
}));

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  symbol?: string;
  currentPrice?: number;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  symbol = 'NVDA',
  currentPrice = 193.12,
}) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyWebhook, setNotifyWebhook] = useState(false);
  const [notifySMS, setNotifySMS] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Alert created:', values);
      message.success('警报已创建');
      form.resetFields();
      onClose();
    });
  };

  const handleNext = () => {
    const nextTab = String(Number(activeTab) + 1);
    if (Number(nextTab) <= 3) {
      setActiveTab(nextTab);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: '设置',
      children: (
        <div>
          {/* 条件部分 */}
          <div className={styles.sectionTitle}>条件</div>
          
          <div className={styles.conditionRow}>
            <Select
              defaultValue="price"
              style={{ width: 120 }}
              options={[
                { value: 'price', label: '价格' },
                { value: 'volume', label: '成交量' },
                { value: 'ma', label: 'MA' },
                { value: 'rsi', label: 'RSI' },
                { value: 'macd', label: 'MACD' },
              ]}
            />
            
            <Select
              defaultValue="crossUp"
              style={{ flex: 1 }}
              options={[
                { value: 'crossUp', label: '穿越向上' },
                { value: 'crossDown', label: '穿越向下' },
                { value: 'greater', label: '大于' },
                { value: 'less', label: '小于' },
                { value: 'equal', label: '等于' },
              ]}
            />
            
            <InputNumber
              style={{ width: 120 }}
              defaultValue={currentPrice}
              precision={2}
              controls={false}
            />
          </div>

          <div className={styles.helperText}>
            当 {symbol} 的价格穿越向上 {currentPrice} 时触发警报
          </div>

          {/* 选项部分 */}
          <div className={styles.sectionTitle}>选项</div>
          
          <Form.Item
            name="frequency"
            className={styles.formItem}
            initialValue="once"
          >
            <Select
              options={[
                { value: 'once', label: '仅触发一次' },
                { value: 'oncebar', label: '每个K线触发一次' },
                { value: 'every', label: '每次满足条件时触发' },
              ]}
            />
          </Form.Item>

          {/* 过期时间 */}
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="expiryDate"
                label="过期时间"
                className={styles.formItem}
              >
                <Input type="date" placeholder="选择日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiryTime" className={styles.formItem} label=" ">
                <Input type="time" placeholder="选择时间" />
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.helperText}>
            警报将在指定时间后自动失效
          </div>

          {/* 价格和成交量 */}
          <div className={styles.sectionTitle}>显示设置</div>
          
          <Form.Item
            name="showPrice"
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: 8 }}
          >
            <Checkbox>在图表上显示价格线</Checkbox>
          </Form.Item>

          <Form.Item
            name="showVolume"
            valuePropName="checked"
            initialValue={false}
            style={{ marginBottom: 0 }}
          >
            <Checkbox>在图表上显示成交量</Checkbox>
          </Form.Item>
        </div>
      ),
    },
    {
      key: '2',
      label: '消息',
      children: (
        <div>
          <Form.Item
            name="alertName"
            label="警报名称"
            className={styles.formItem}
          >
            <Input
              placeholder={`${symbol} 穿越向上 ${currentPrice}`}
              maxLength={100}
            />
          </Form.Item>

          <div className={styles.helperText} style={{ marginTop: -8, marginBottom: 16 }}>
            为警报设置一个易于识别的名称
          </div>

          <Form.Item name="message" label="消息内容" className={styles.formItem}>
            <TextArea
              rows={6}
              placeholder={`${symbol} 价格已穿越 ${currentPrice}\n触发时间: {{time}}\n当前价格: {{price}}`}
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <div className={styles.helperText} style={{ marginTop: -8, marginBottom: 16 }}>
            您可以使用占位符：{'{{price}}, {{time}}, {{volume}}'} 等
          </div>

          <Form.Item
            name="playSound"
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: 0 }}
          >
            <Checkbox>播放提示音</Checkbox>
          </Form.Item>

          <div className={styles.helperText} style={{ marginLeft: 24 }}>
            警报触发时播放声音提醒
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: '通知',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 14 }}>
              通知方式
            </Text>
            <div className={styles.helperText} style={{ marginTop: 4 }}>
              选择警报触发时接收通知的方式
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <Form.Item
              name="notifyApp"
              valuePropName="checked"
              initialValue={true}
              style={{ marginBottom: 0 }}
            >
              <Checkbox>网站和移动应用通知</Checkbox>
            </Form.Item>

            <Form.Item
              name="showOnChart"
              valuePropName="checked"
              initialValue={true}
              style={{ marginBottom: 0 }}
            >
              <Checkbox>在图表上显示</Checkbox>
            </Form.Item>

            <div style={{ marginTop: 8 }}>
              <Checkbox
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
              >
                发送邮件到
              </Checkbox>
              {notifyEmail && (
                <Form.Item name="email" className={styles.subInput}>
                  <Input type="email" placeholder="your-email@example.com" />
                </Form.Item>
              )}
            </div>

            <div>
              <Checkbox
                checked={notifyWebhook}
                onChange={(e) => setNotifyWebhook(e.target.checked)}
              >
                Webhook URL
              </Checkbox>
              {notifyWebhook && (
                <>
                  <Form.Item name="webhookUrl" className={styles.subInput}>
                    <Input placeholder="https://webhook.example.com/alert" />
                  </Form.Item>
                  <div
                    className={styles.helperText}
                    style={{ marginLeft: 24, marginTop: -8 }}
                  >
                    将发送 POST 请求到此 URL
                  </div>
                </>
              )}
            </div>

            <div>
              <Checkbox
                checked={notifySMS}
                onChange={(e) => setNotifySMS(e.target.checked)}
              >
                发送短信到
              </Checkbox>
              {notifySMS && (
                <>
                  <Form.Item name="sms" className={styles.subInput}>
                    <Input placeholder="+86 138 0000 0000" />
                  </Form.Item>
                  <div
                    className={styles.helperText}
                    style={{ marginLeft: 24, marginTop: -8 }}
                  >
                    需要订阅 Premium 计划
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BellOutlined />
          <span>创建警报 - {symbol}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={520}
      className={styles.modal}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {activeTab !== '3' && (
              <Button onClick={handleNext}>下一步</Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              创建警报
            </Button>
          </div>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          symbol,
          price: currentPrice,
          frequency: 'once',
          notifyApp: true,
          showOnChart: true,
          playSound: true,
          showPrice: true,
          showVolume: false,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
        />
      </Form>
    </Modal>
  );
};

export default AlertModal;
