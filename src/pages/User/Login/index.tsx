/**
 * 登录页面
 */
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Space, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { history, useModel, useIntl, SelectLang, Link } from 'umi';
import { login } from '@/services/user';
import { flushSync } from 'react-dom';
import styles from './index.less';

const { Title, Text } = Typography;

// 测试账户信息卡片
const TestAccountsCard: React.FC = () => {
  const testAccounts = [
    { username: 'admin', password: 'admin123', role: '管理员', desc: '完全权限' },
    { username: 'trader', password: 'trader123', role: '交易员', desc: '交易权限' },
    { username: 'analyst', password: 'analyst123', role: '分析师', desc: '分析权限' },
    { username: 'guest', password: 'guest123', role: '访客', desc: '只读权限' },
  ];

  const copyAccount = (username: string, password: string) => {
    navigator.clipboard.writeText(`${username}/${password}`);
    message.success(`已复制: ${username}/${password}`);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card
      title="测试账户"
      size="small"
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        width: '280px',
        zIndex: 1000,
      }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {testAccounts.map((account, index) => (
          <div
            key={index}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
              transition: 'all 0.2s',
            }}
            onClick={() => copyAccount(account.username, account.password)}
          >
            <div style={{ fontSize: '12px' }}>
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                {account.username} / {account.password}
              </div>
              <div style={{ color: '#666', marginTop: '2px' }}>
                {account.role} - {account.desc}
              </div>
            </div>
          </div>
        ))}
        <Text type="secondary" style={{ fontSize: '10px', textAlign: 'center', display: 'block' }}>
          点击复制账户密码
        </Text>
      </Space>
    </Card>
  );
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [form] = Form.useForm();

  const fetchUserInfo = async (userProfile?: any) => {
    if (userProfile) {
      // 使用登录返回的用户信息
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: {
            name: userProfile.displayName || userProfile.username,
            avatar: userProfile.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            userid: userProfile.id,
            email: userProfile.email,
            signature: '用户',
            title: '用户',
            group: '股票交易系统',
            access: 'user',
          },
        }));
      });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await login({
        username: values.username,
        password: values.password,
        remember: values.remember,
      });

      if (response?.token) {
        message.success('登录成功！');

        // 设置用户信息
        await fetchUserInfo(response.user);

        // 跳转到目标页面
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }
    } catch (err: any) {
      console.error('登录错误:', err);
      setError(err.message || '登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      {/* 语言切换 */}
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <SelectLang />
      </div>

      {/* 测试账户卡片 */}
      <TestAccountsCard />

      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <Title level={2} style={{ color: '#00FC50', margin: 0 }}>
            CN Stock Platform
          </Title>
          <Text type="secondary">智能股票交易系统</Text>
        </div>

        <Title level={3} className={styles.title}>
          登录
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <a className={styles.forgot} onClick={() => message.info('请联系管理员重置密码')}>
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              还没有账户？{' '}
              <Link to="/user/register">立即注册</Link>
            </Text>
          </div>
        </Form>
      </div>

      <div className={styles.footer}>
        CN Stock Platform © 2024
      </div>
    </div>
  );
};

export default Login;
