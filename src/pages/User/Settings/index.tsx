/**
 * 用户设置页面
 * Phase 5: 用户系统 - 用户设置
 */

import React from 'react';
import { Card, Form, Switch, Select, Button, message, Divider, Space } from 'antd';
import { BellOutlined, EyeOutlined, LineChartOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getUserSettings, updateUserSettings } from '@/services/user';
import type { UserSettings } from '@/typings/user';
import styles from './index.less';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  // 获取用户设置
  const { data: settings, loading } = useRequest(getUserSettings, {
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
  });

  // 更新用户设置
  const { run: updateSettings, loading: updating } = useRequest(updateUserSettings, {
    manual: true,
    onSuccess: () => {
      message.success('设置保存成功');
    },
    onError: () => {
      message.error('设置保存失败');
    },
  });

  const onFinish = (values: UserSettings) => {
    updateSettings(values);
  };

  return (
    <div className={styles.settings}>
      <Card title="用户设置" loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={settings}
        >
          {/* 通知设置 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <BellOutlined />
              <span>通知设置</span>
            </div>
            <Divider />

            <Form.Item
              label="价格提醒"
              name={['notification', 'priceAlert']}
              valuePropName="checked"
              extra="当股票价格达到设定值时通知您"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="新闻提醒"
              name={['notification', 'newsAlert']}
              valuePropName="checked"
              extra="自选股的重要新闻推送"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="财报提醒"
              name={['notification', 'earningsAlert']}
              valuePropName="checked"
              extra="自选股的财报发布提醒"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="市场提醒"
              name={['notification', 'marketAlert']}
              valuePropName="checked"
              extra="重要市场动态推送"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="邮件通知"
              name={['notification', 'email']}
              valuePropName="checked"
              extra="通过邮件接收通知"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="推送通知"
              name={['notification', 'push']}
              valuePropName="checked"
              extra="通过浏览器推送接收通知"
            >
              <Switch />
            </Form.Item>
          </div>

          {/* 显示设置 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <EyeOutlined />
              <span>显示设置</span>
            </div>
            <Divider />

            <Form.Item
              label="主题"
              name={['display', 'theme']}
              extra="选择您偏好的界面主题"
            >
              <Select>
                <Select.Option value="light">浅色</Select.Option>
                <Select.Option value="dark">深色</Select.Option>
                <Select.Option value="auto">跟随系统</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="语言"
              name={['display', 'language']}
              extra="选择界面显示语言"
            >
              <Select>
                <Select.Option value="zh-CN">简体中文</Select.Option>
                <Select.Option value="en-US">English</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="默认市场"
              name={['display', 'defaultMarket']}
              extra="设置默认展示的交易市场"
            >
              <Select>
                <Select.Option value="sh">上海证券交易所</Select.Option>
                <Select.Option value="sz">深圳证券交易所</Select.Option>
                <Select.Option value="bj">北京证券交易所</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* 交易设置 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <LineChartOutlined />
              <span>交易设置</span>
            </div>
            <Divider />

            <Form.Item
              label="显示盘前数据"
              name={['trading', 'showPreMarket']}
              valuePropName="checked"
              extra="在图表中显示集合竞价数据"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="显示盘后数据"
              name={['trading', 'showAfterMarket']}
              valuePropName="checked"
              extra="在图表中显示盘后交易数据"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="默认图表周期"
              name={['trading', 'defaultChartPeriod']}
              extra="设置打开股票详情时的默认图表周期"
            >
              <Select>
                <Select.Option value="1day">日K</Select.Option>
                <Select.Option value="1week">周K</Select.Option>
                <Select.Option value="1month">月K</Select.Option>
                <Select.Option value="realtime">分时</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* 提交按钮 */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={updating}>
                保存设置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
