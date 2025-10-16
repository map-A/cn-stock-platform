/**
 * 通知中心页面
 * Phase 5: 用户系统 - 通知系统
 */

import React, { useState } from 'react';
import { Card, List, Badge, Tabs, Button, Empty, Tag, Space, Modal, message } from 'antd';
import {
  BellOutlined,
  DollarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { history } from '@umijs/max';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/services/user';
import type { Notification, NotificationType } from '@/typings/user';
import styles from './index.less';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationType | 'all'>('all');

  // 获取通知列表
  const { data, loading, refresh } = useRequest(
    () => getNotifications({
      type: activeTab === 'all' ? undefined : activeTab,
      page: 1,
      pageSize: 50,
    }),
    {
      refreshDeps: [activeTab],
    },
  );

  // 标记为已读
  const { run: markRead } = useRequest(markNotificationRead, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  // 标记全部已读
  const { run: markAllRead, loading: markAllLoading } = useRequest(markAllNotificationsRead, {
    manual: true,
    onSuccess: () => {
      message.success('已全部标记为已读');
      refresh();
    },
  });

  // 删除通知
  const { run: deleteNotif } = useRequest(deleteNotification, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      refresh();
    },
  });

  // 处理点击通知
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markRead(notification.id);
    }
    if (notification.link) {
      history.push(notification.link);
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      price: <DollarOutlined style={{ color: '#52c41a' }} />,
      news: <FileTextOutlined style={{ color: '#1890ff' }} />,
      earnings: <BarChartOutlined style={{ color: '#faad14' }} />,
      market: <BellOutlined style={{ color: '#722ed1' }} />,
      system: <SettingOutlined style={{ color: '#666' }} />,
    };
    return icons[type] || <BellOutlined />;
  };

  // 获取通知类型标签
  const getTypeTag = (type: NotificationType) => {
    const tags = {
      price: { text: '价格', color: 'success' },
      news: { text: '新闻', color: 'processing' },
      earnings: { text: '财报', color: 'warning' },
      market: { text: '市场', color: 'purple' },
      system: { text: '系统', color: 'default' },
    };
    const tag = tags[type];
    return <Tag color={tag.color}>{tag.text}</Tag>;
  };

  const tabs = [
    { key: 'all', label: '全部', icon: <BellOutlined /> },
    { key: 'price', label: '价格提醒', icon: <DollarOutlined /> },
    { key: 'news', label: '新闻', icon: <FileTextOutlined /> },
    { key: 'earnings', label: '财报', icon: <BarChartOutlined /> },
    { key: 'market', label: '市场', icon: <BellOutlined /> },
    { key: 'system', label: '系统', icon: <SettingOutlined /> },
  ];

  const unreadCount = data?.list.filter((n) => !n.read).length || 0;

  return (
    <div className={styles.notifications}>
      <Card
        title={
          <Space>
            <BellOutlined />
            <span>消息通知</span>
            {unreadCount > 0 && <Badge count={unreadCount} />}
          </Space>
        }
        extra={
          <Space>
            {unreadCount > 0 && (
              <Button
                type="link"
                icon={<CheckOutlined />}
                loading={markAllLoading}
                onClick={() => markAllRead()}
              >
                全部已读
              </Button>
            )}
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as NotificationType | 'all')}
          items={tabs.map((tab) => ({
            key: tab.key,
            label: (
              <span>
                {tab.icon}
                <span style={{ marginLeft: 8 }}>{tab.label}</span>
              </span>
            ),
          }))}
        />

        <List
          loading={loading}
          dataSource={data?.list}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无通知"
              />
            ),
          }}
          renderItem={(item) => (
            <List.Item
              className={`${styles.notificationItem} ${!item.read ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(item)}
              actions={[
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    Modal.confirm({
                      title: '确认删除',
                      content: '确定要删除这条通知吗？',
                      onOk: () => deleteNotif(item.id),
                    });
                  }}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className={styles.avatar}>
                    {getNotificationIcon(item.type)}
                  </div>
                }
                title={
                  <div className={styles.title}>
                    <span>{item.title}</span>
                    {getTypeTag(item.type)}
                    {!item.read && <Badge status="error" />}
                  </div>
                }
                description={
                  <div className={styles.description}>
                    <p>{item.content}</p>
                    <span className={styles.time}>{item.createTime}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;
