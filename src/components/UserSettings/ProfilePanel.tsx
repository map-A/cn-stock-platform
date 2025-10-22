/**
 * 个人信息面板组件
 * 
 * 功能特性:
 * - 个人信息查看与编辑
 * - 头像上传
 * - 密码修改
 * - 账户统计信息
 */

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Upload,
  Avatar,
  message,
  Modal,
  Row,
  Col,
  Descriptions,
  Tag,
  Typography,
  Select,
  Divider,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  updateUserProfile,
  uploadAvatar,
  changePassword,
} from '@/services/user';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '@/types/user';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface ProfilePanelProps {
  profile?: UserProfile;
  onUpdate?: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 编辑个人信息
  const handleEdit = () => {
    if (!profile) return;
    
    form.setFieldsValue({
      nickname: profile.nickname,
      realName: profile.realName,
      phone: profile.phone,
      bio: profile.bio,
      timezone: profile.timezone,
      language: profile.language,
    });
    setEditMode(true);
  };

  // 保存个人信息
  const handleSave = async (values: UpdateProfileRequest) => {
    try {
      setLoading(true);
      await updateUserProfile(values);
      message.success('个人信息更新成功');
      setEditMode(false);
      onUpdate?.();
    } catch (error) {
      console.error('更新个人信息失败:', error);
      message.error('更新个人信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setEditMode(false);
    form.resetFields();
  };

  // 头像上传
  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true);
      const result = await uploadAvatar(file);
      await updateUserProfile({ avatar: result.url });
      message.success('头像更新成功');
      onUpdate?.();
      return result.url;
    } catch (error) {
      console.error('头像上传失败:', error);
      message.error('头像上传失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (values: ChangePasswordRequest) => {
    try {
      setLoading(true);
      await changePassword(values);
      message.success('密码修改成功');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('密码修改失败:', error);
      message.error('密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  // 头像上传属性
  const uploadProps = {
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB');
        return false;
      }
      
      handleAvatarUpload(file);
      return false;
    },
    showUploadList: false,
  };

  if (!profile) {
    return <Card loading />;
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card title="头像设置">
            <div style={{ textAlign: 'center' }}>
              <Upload {...uploadProps}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    size={120}
                    src={profile.avatar}
                    icon={<UserOutlined />}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#1890ff',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    <CameraOutlined />
                  </div>
                </div>
              </Upload>
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">点击更换头像</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  支持 JPG、PNG 格式，不超过 2MB
                </Text>
              </div>
            </div>
          </Card>

          <Card title="账户信息" style={{ marginTop: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="用户名">
                {profile.username}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {profile.email}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={profile.status === 'active' ? 'green' : 'red'}>
                  {profile.status === 'active' ? '活跃' : '非活跃'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {new Date(profile.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                {profile.lastLoginTime ? new Date(profile.lastLoginTime).toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="登录次数">
                {profile.loginCount}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={() => setPasswordModalVisible(true)}
              block
            >
              修改密码
            </Button>
          </Card>
        </Col>

        <Col span={16}>
          <Card
            title="个人信息"
            extra={
              !editMode ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  编辑
                </Button>
              ) : null
            }
          >
            {editMode ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="昵称"
                      name="nickname"
                      rules={[{ max: 50, message: '昵称不能超过50个字符' }]}
                    >
                      <Input placeholder="请输入昵称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="真实姓名"
                      name="realName"
                      rules={[{ max: 20, message: '真实姓名不能超过20个字符' }]}
                    >
                      <Input placeholder="请输入真实姓名" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="手机号"
                      name="phone"
                      rules={[
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                      ]}
                    >
                      <Input placeholder="请输入手机号" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="时区"
                      name="timezone"
                    >
                      <Select placeholder="请选择时区">
                        <Option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</Option>
                        <Option value="America/New_York">America/New_York (GMT-5)</Option>
                        <Option value="Europe/London">Europe/London (GMT+0)</Option>
                        <Option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="语言偏好"
                  name="language"
                >
                  <Select placeholder="请选择语言">
                    <Option value="zh-CN">简体中文</Option>
                    <Option value="en-US">English</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="个人简介"
                  name="bio"
                  rules={[{ max: 200, message: '个人简介不能超过200个字符' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请输入个人简介"
                    showCount
                    maxLength={200}
                  />
                </Form.Item>

                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    保存
                  </Button>
                  <Button onClick={handleCancel}>
                    取消
                  </Button>
                </Space>
              </Form>
            ) : (
              <Descriptions column={2} bordered>
                <Descriptions.Item label="昵称">
                  {profile.nickname || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="真实姓名">
                  {profile.realName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="手机号">
                  {profile.phone || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="部门">
                  {profile.department || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="职位">
                  {profile.position || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="时区">
                  {profile.timezone}
                </Descriptions.Item>
                <Descriptions.Item label="语言">
                  {profile.language === 'zh-CN' ? '简体中文' : 'English'}
                </Descriptions.Item>
                <Descriptions.Item label="个人简介" span={2}>
                  {profile.bio || '-'}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>
      </Row>

      {/* 修改密码对话框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              placeholder="请输入当前密码"
              iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少8位' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' }
            ]}
          >
            <Input.Password
              placeholder="请输入新密码"
              iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            />
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
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="请再次输入新密码"
              iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPasswordModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePanel;