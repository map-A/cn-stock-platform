/**
 * 个性化设置页面
 * 用户可以配置账户、通知、隐私等设置
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { toast } from '@/utils/toast';
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/services/notification';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Smartphone,
  History,
} from 'lucide-react';
import ActivityLogPanel from '@/components/Settings/ActivityLogPanel';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'appearance' | 'privacy' | 'logs'>('account');
  
  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    priceAlert: true,
    earnings: true,
    news: true,
    dividend: true,
    filing: true,
    system: true,
    email: true,
    push: true,
  });

  // 账户设置
  const [accountSettings, setAccountSettings] = useState({
    displayName: '',
    email: '',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
  });

  // 外观设置
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    compactMode: false,
    showAnimations: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    
    // 加载通知设置
    const response = await getNotificationSettings();
    if (response.success && response.data) {
      setNotificationSettings(response.data);
    }
    
    setLoading(false);
  };

  const handleSaveNotifications = async () => {
    const response = await updateNotificationSettings(notificationSettings);
    
    if (response.success) {
      toast.success('通知设置已保存');
    } else {
      toast.error(response.message || '保存失败');
    }
  };

  const handleSaveAccount = async () => {
    // TODO: 实现账户设置保存
    toast.success('账户设置已保存');
  };

  const handleSaveAppearance = async () => {
    // TODO: 实现外观设置保存
    toast.success('外观设置已保存');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8" />
          设置
        </h1>
        <p className="text-muted-foreground mt-2">
          管理您的账户和偏好设置
        </p>
      </div>

      {/* 设置标签页 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            账户
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            通知
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            外观
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            隐私
          </TabsTrigger>
          <TabsTrigger value="logs">
            <History className="w-4 h-4 mr-2" />
            活动日志
          </TabsTrigger>
        </TabsList>

        {/* 账户设置 */}
        <TabsContent value="account">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">账户信息</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  显示名称
                </label>
                <Input
                  value={accountSettings.displayName}
                  onChange={(e) => setAccountSettings(prev => ({
                    ...prev,
                    displayName: e.target.value
                  }))}
                  placeholder="输入您的显示名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  电子邮件
                </label>
                <Input
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => setAccountSettings(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  语言
                </label>
                <Select
                  value={accountSettings.language}
                  onChange={(e) => setAccountSettings(prev => ({
                    ...prev,
                    language: e.target.value
                  }))}
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁體中文</option>
                  <option value="en-US">English</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  时区
                </label>
                <Select
                  value={accountSettings.timezone}
                  onChange={(e) => setAccountSettings(prev => ({
                    ...prev,
                    timezone: e.target.value
                  }))}
                >
                  <option value="Asia/Shanghai">北京时间 (GMT+8)</option>
                  <option value="Asia/Hong_Kong">香港时间 (GMT+8)</option>
                  <option value="America/New_York">纽约时间 (GMT-5)</option>
                  <option value="Europe/London">伦敦时间 (GMT+0)</option>
                </Select>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAccount}>
                  保存更改
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">通知偏好</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">通知类型</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">价格提醒</p>
                      <p className="text-sm text-muted-foreground">
                        当股票价格达到您设置的目标时通知您
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.priceAlert}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        priceAlert: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">财报公告</p>
                      <p className="text-sm text-muted-foreground">
                        您关注的公司发布财报时通知您
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.earnings}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        earnings: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">新闻动态</p>
                      <p className="text-sm text-muted-foreground">
                        关注股票的重要新闻推送
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.news}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        news: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">分红公告</p>
                      <p className="text-sm text-muted-foreground">
                        股票分红信息推送
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.dividend}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        dividend: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SEC文件</p>
                      <p className="text-sm text-muted-foreground">
                        公司提交重要监管文件时通知
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.filing}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        filing: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">系统通知</p>
                      <p className="text-sm text-muted-foreground">
                        平台更新和重要系统消息
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.system}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        system: checked
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">通知渠道</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        <Mail className="w-4 h-4 inline mr-1" />
                        邮件通知
                      </p>
                      <p className="text-sm text-muted-foreground">
                        通过电子邮件接收通知
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        email: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        推送通知
                      </p>
                      <p className="text-sm text-muted-foreground">
                        通过浏览器推送接收通知
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        push: checked
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications}>
                  保存更改
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">外观设置</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  主题
                </label>
                <Select
                  value={appearanceSettings.theme}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    theme: e.target.value as any
                  }))}
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">紧凑模式</p>
                  <p className="text-sm text-muted-foreground">
                    减少界面元素之间的间距
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.compactMode}
                  onCheckedChange={(checked) => setAppearanceSettings(prev => ({
                    ...prev,
                    compactMode: checked
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">动画效果</p>
                  <p className="text-sm text-muted-foreground">
                    启用界面动画和过渡效果
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.showAnimations}
                  onCheckedChange={(checked) => setAppearanceSettings(prev => ({
                    ...prev,
                    showAnimations: checked
                  }))}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAppearance}>
                  保存更改
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 隐私设置 */}
        <TabsContent value="privacy">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">隐私与安全</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">个人资料公开</p>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户查看您的个人资料
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">观察列表公开</p>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户查看您的观察列表
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">数据与隐私</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    下载我的数据
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    删除账户
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 活动日志 */}
        <TabsContent value="logs">
          <ActivityLogPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
