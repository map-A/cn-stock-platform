/**
 * 登录页面
 */
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, history } from '@umijs/max';
import { useUserStore } from '@/models/user';
import styles from './index.less';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useUserStore();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 实际的登录API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟登录成功
      const mockUser = {
        id: '1',
        username: values.username,
        email: 'user@example.com',
        tier: 'Pro' as const,
        isPro: true,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);

      message.success('登录成功！');
      history.push('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <Title level={3} className={styles.title}>
        登录
      </Title>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Link to="/user/forgot-password">忘记密码？</Link>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            登录
          </Button>
        </Form.Item>

        <div className={styles.footer}>
          <Text type="secondary">还没有账号？</Text>
          <Link to="/user/register"> 立即注册</Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
