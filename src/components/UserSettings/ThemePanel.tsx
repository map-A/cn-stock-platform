/**
 * 主题设置面板组件
 * 
 * 功能特性:
 * - 主题色调配置
 * - 深色/浅色模式切换
 * - 布局设置
 * - 字体大小设置
 * - 动画效果设置
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Switch,
  Slider,
  Select,
  Button,
  Space,
  message,
  Divider,
  Typography,
  Tooltip,
  ColorPicker,
} from 'antd';
import {
  BgColorsOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  updateThemeSettings,
  resetUserSettings,
} from '@/services/user';
import type { ThemeSettings } from '@/types/user';

const { Option } = Select;
const { Text, Title } = Typography;

interface ThemePanelProps {
  theme?: ThemeSettings;
  onUpdate?: () => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ theme, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeSettings | undefined>(theme);

  // 更新主题设置
  const handleUpdateTheme = async (updates: Partial<ThemeSettings>) => {
    if (!currentTheme) return;

    const newTheme = { ...currentTheme, ...updates };
    setCurrentTheme(newTheme);

    try {
      await updateThemeSettings(updates);
      message.success('主题设置已更新');
      onUpdate?.();
    } catch (error) {
      console.error('更新主题设置失败:', error);
      message.error('更新主题设置失败');
      // 回滚状态
      setCurrentTheme(currentTheme);
    }
  };

  // 重置主题设置
  const handleResetTheme = async () => {
    try {
      setLoading(true);
      await resetUserSettings('theme');
      message.success('主题设置已重置');
      onUpdate?.();
    } catch (error) {
      console.error('重置主题设置失败:', error);
      message.error('重置主题设置失败');
    } finally {
      setLoading(false);
    }
  };

  if (!currentTheme) {
    return <Card loading />;
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title={
            <Space>
              <BgColorsOutlined />
              颜色设置
            </Space>
          }>
            <div style={{ marginBottom: 16 }}>
              <Text strong>主题色</Text>
              <div style={{ marginTop: 8 }}>
                <ColorPicker
                  value={currentTheme.primaryColor}
                  onChange={(color) => {
                    handleUpdateTheme({ primaryColor: color.toHexString() });
                  }}
                  presets={[
                    {
                      label: '推荐色彩',
                      colors: [
                        '#1890ff',
                        '#722ed1',
                        '#13c2c2',
                        '#52c41a',
                        '#fa8c16',
                        '#f5222d',
                        '#eb2f96',
                        '#faad14',
                      ],
                    },
                  ]}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>深色模式</Text>
                <Switch
                  checked={currentTheme.darkMode}
                  onChange={(checked) => handleUpdateTheme({ darkMode: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                切换深色/浅色主题
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>色弱模式</Text>
                <Switch
                  checked={currentTheme.colorWeak}
                  onChange={(checked) => handleUpdateTheme({ colorWeak: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                为色弱用户优化色彩显示
              </Text>
            </div>
          </Card>

          <Card 
            title={
              <Space>
                <FontSizeOutlined />
                字体设置
              </Space>
            }
            style={{ marginTop: 16 }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>字体大小</Text>
              <div style={{ marginTop: 8 }}>
                <Select
                  style={{ width: '100%' }}
                  value={currentTheme.fontSize}
                  onChange={(value) => handleUpdateTheme({ fontSize: value })}
                >
                  <Option value="small">小</Option>
                  <Option value="medium">中</Option>
                  <Option value="large">大</Option>
                </Select>
              </div>
            </div>

            <div>
              <Text strong>圆角大小</Text>
              <div style={{ marginTop: 8 }}>
                <Select
                  style={{ width: '100%' }}
                  value={currentTheme.borderRadius}
                  onChange={(value) => handleUpdateTheme({ borderRadius: value })}
                >
                  <Option value="small">小圆角</Option>
                  <Option value="medium">中圆角</Option>
                  <Option value="large">大圆角</Option>
                </Select>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={
            <Space>
              <LayoutOutlined />
              布局设置
            </Space>
          }>
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>紧凑模式</Text>
                <Switch
                  checked={currentTheme.compactMode}
                  onChange={(checked) => handleUpdateTheme({ compactMode: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                减少页面间距，显示更多内容
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>侧边栏收起</Text>
                <Switch
                  checked={currentTheme.sidebarCollapsed}
                  onChange={(checked) => handleUpdateTheme({ sidebarCollapsed: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                默认收起侧边栏导航
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>固定头部</Text>
                <Switch
                  checked={currentTheme.fixedHeader}
                  onChange={(checked) => handleUpdateTheme({ fixedHeader: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                滚动时保持头部固定
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>固定侧边栏</Text>
                <Switch
                  checked={currentTheme.fixedSidebar}
                  onChange={(checked) => handleUpdateTheme({ fixedSidebar: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                滚动时保持侧边栏固定
              </Text>
            </div>

            <div>
              <Row justify="space-between" align="middle">
                <Text strong>内容区域填充</Text>
                <Switch
                  checked={currentTheme.contentAreaFillHeight}
                  onChange={(checked) => handleUpdateTheme({ contentAreaFillHeight: checked })}
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                内容区域自动填充屏幕高度
              </Text>
            </div>
          </Card>

          <Card 
            title={
              <Space>
                <ThunderboltOutlined />
                动画设置
              </Space>
            }
            style={{ marginTop: 16 }}
          >
            <div>
              <Text strong>动画效果</Text>
              <div style={{ marginTop: 8 }}>
                <Select
                  style={{ width: '100%' }}
                  value={currentTheme.animationLevel}
                  onChange={(value) => handleUpdateTheme({ animationLevel: value })}
                >
                  <Option value="none">关闭动画</Option>
                  <Option value="basic">基础动画</Option>
                  <Option value="advanced">完整动画</Option>
                </Select>
              </div>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
                关闭动画可以提高性能
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="主题预览" style={{ marginTop: 24 }}>
        <div 
          style={{ 
            padding: 24,
            background: currentTheme.darkMode ? '#141414' : '#f5f5f5',
            borderRadius: currentTheme.borderRadius === 'small' ? 4 : 
                         currentTheme.borderRadius === 'medium' ? 8 : 12,
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              background: currentTheme.darkMode ? '#1f1f1f' : '#ffffff',
              padding: 16,
              borderRadius: currentTheme.borderRadius === 'small' ? 4 : 
                           currentTheme.borderRadius === 'medium' ? 8 : 12,
              fontSize: currentTheme.fontSize === 'small' ? 12 : 
                       currentTheme.fontSize === 'medium' ? 14 : 16,
              color: currentTheme.darkMode ? '#ffffff' : '#000000',
            }}
          >
            <Title 
              level={4} 
              style={{ 
                color: currentTheme.primaryColor,
                margin: '0 0 16px 0',
                fontSize: currentTheme.fontSize === 'small' ? 16 : 
                         currentTheme.fontSize === 'medium' ? 18 : 20,
              }}
            >
              主题预览
            </Title>
            <Text style={{ color: currentTheme.darkMode ? '#ffffff' : '#000000' }}>
              这是当前主题的预览效果。您可以看到主色调、字体大小、圆角大小等设置的实际效果。
            </Text>
            <div style={{ marginTop: 16 }}>
              <Button 
                type="primary" 
                style={{ 
                  backgroundColor: currentTheme.primaryColor,
                  borderColor: currentTheme.primaryColor,
                  borderRadius: currentTheme.borderRadius === 'small' ? 4 : 
                               currentTheme.borderRadius === 'medium' ? 6 : 8,
                }}
              >
                主色调按钮
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Space size="large">
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={handleResetTheme}
            loading={loading}
          >
            重置为默认
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ThemePanel;