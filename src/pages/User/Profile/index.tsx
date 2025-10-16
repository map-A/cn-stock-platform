/**
 * 个人中心页面
 * Phase 5: 用户系统 - 个人中心
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Descriptions,
  Statistic,
  Upload,
  message,
  Modal,
  Form,
  Input,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  CrownOutlined,
  StarOutlined,
  EyeOutlined,
  SearchOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { history } from '@umijs/max';
import { useUserStore } from '@/models/user';
import {
  getUserStats,
  uploadAvatar,
  updateUserInfo,
  changePassword,
} from '@/services/user';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './index.less';

const Profile: React.FC = () => {
  const { user, updateUserInfo: updateStoreUser } = useUserStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 获取用户统计
  const { data: stats } = useRequest(getUserStats);

  // 上传头像
  const { run: handleUploadAvatar, loading: uploading } = useRequest(uploadAvatar, {
    manual: true,
    onSuccess: (data) => {
      message.success('头像上传成功');
      updateStoreUser({ avatar: data.url });
    },
    onError: () => {
      message.error('头像上传失败');
    },
  });

  // 更新用户信息
  const { run: handleUpdateInfo, loading: updating } = useRequest(updateUserInfo, {
    manual: true,
    onSuccess: (data) => {
      message.success('信息更新成功');
      updateStoreUser(data);
      setEditModalVisible(false);
    },
    onError: () => {
      message.error('信息更新失败');
    },
  });

  // 修改密码
  const { run: handleChangePassword, loading: changing } = useRequest(changePassword, {
    manual: true,
    onSuccess: () => {
      message.success('密码修改成功，请重新登录');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
      // 跳转到登录页
      setTimeout(() => {
        history.push('/user/login');
      }, 1000);
    },
    onError: () => {
      message.error('密码修改失败');
    },
  });

  const handleAvatarUpload = (file: UploadFile) => {
    handleUploadAvatar(file.originFileObj as File);
    return false; // 阻止默认上传行为
  };

  const onEditSubmit = (values: any) => {
    handleUpdateInfo(values);
  };

  const onPasswordSubmit = (values: any) => {
    handleChangePassword(values.oldPassword, values.newPassword);
  };

  return (
    <div className={styles.profile}>
      <Row gutter={[24, 24]}>
        {/* 左侧：用户信息 */}
        <Col xs={24} md={8}>
          <Card className={styles.userCard}>
            <div className={styles.avatarSection}>
              <Avatar
                size={120}
                src={user?.avatar}
                icon={<UserOutlined />}
                className={styles.avatar}
              />
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleAvatarUpload}
              >
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  loading={uploading}
                  className={styles.uploadBtn}
                >
                  更换头像
                </Button>
              </Upload>
            </div>

            <div className={styles.userInfo}>
              <h2>{user?.username}</h2>
              <p className={styles.email}>{user?.email}</p>
              <div className={styles.tier}>
                <CrownOutlined />
                <span>{user?.tier} 会员</span>
                {user?.tier !== 'Premium' && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => history.push('/user/membership')}
                  >
                    升级
                  </Button>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                type="default"
                block
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    username: user?.username,
                    email: user?.email,
                  });
                  setEditModalVisible(true);
                }}
              >
                编辑资料
              </Button>
              <Button
                type="default"
                block
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                修改密码
              </Button>
            </div>
          </Card>

          {/* 会员信息 */}
          <Card className={styles.memberCard} title="会员信息">
            <Descriptions column={1}>
              <Descriptions.Item label="会员等级">{user?.tier}</Descriptions.Item>
              <Descriptions.Item label="到期时间">
                {user?.expiresAt || '永久'}
              </Descriptions.Item>
            </Descriptions>
            {user?.tier !== 'Premium' && (
              <Button
                type="primary"
                block
                onClick={() => history.push('/user/membership')}
              >
                升级会员
              </Button>
            )}
          </Card>
        </Col>

        {/* 右侧：统计信息 */}
        <Col xs={24} md={16}>
          <Card title="数据统计" className={styles.statsCard}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="自选股"
                    value={stats?.watchlistCount || 0}
                    prefix={<StarOutlined />}
                    suffix="只"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="价格提醒"
                    value={stats?.alertCount || 0}
                    prefix={<StarOutlined />}
                    suffix="个"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="浏览记录"
                    value={stats?.viewedStockCount || 0}
                    prefix={<EyeOutlined />}
                    suffix="只"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="搜索次数"
                    value={stats?.searchCount || 0}
                    prefix={<SearchOutlined />}
                    suffix="次"
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 账户信息 */}
          <Card title="账户信息" className={styles.accountCard}>
            <Descriptions column={2}>
              <Descriptions.Item label="用户ID">{user?.id}</Descriptions.Item>
              <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="会员等级">{user?.tier}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* 编辑资料弹窗 */}
      <Modal
        title="编辑资料"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={updating}
      >
        <Form form={form} layout="vertical" onFinish={onEditSubmit}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={() => passwordForm.submit()}
        confirmLoading={changing}
      >
        <Form form={passwordForm} layout="vertical" onFinish={onPasswordSubmit}>
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
