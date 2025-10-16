/**
 * 价格提醒页面
 * 允许用户查看、创建、编辑和删除价格提醒
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { toast } from '@/utils/toast';
import {
  getPriceAlerts,
  createPriceAlert,
  deletePriceAlert,
  deletePriceAlerts,
  groupNews,
  groupEarnings,
  type PriceAlert,
  type PriceAlertNewsItem,
  type PriceAlertEarningsItem,
} from '@/services/priceAlert';
import { formatDate, formatTime, formatNumber } from '@/utils/format';
import { Bell, Plus, Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { StockSearchInput } from '@/components/StockSearchInput';
import { Modal } from '@/components/ui/Modal';

export const PriceAlertPage: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [news, setNews] = useState<PriceAlertNewsItem[]>([]);
  const [earnings, setEarnings] = useState<PriceAlertEarningsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'news' | 'earnings'>('alerts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // 创建提醒表单
  const [createForm, setCreateForm] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await getPriceAlerts();
    
    if (response.success && response.data) {
      setAlerts(response.data.data);
      setNews(response.data.news);
      setEarnings(response.data.earnings);
    } else {
      toast.error(response.message || '加载失败');
    }
    
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!createForm.symbol || !createForm.targetPrice) {
      toast.error('请填写完整信息');
      return;
    }

    const response = await createPriceAlert({
      symbol: createForm.symbol,
      targetPrice: parseFloat(createForm.targetPrice),
      condition: createForm.condition,
    });

    if (response.success) {
      toast.success('创建成功');
      setShowCreateModal(false);
      setCreateForm({ symbol: '', targetPrice: '', condition: 'above' });
      loadData();
    } else {
      toast.error(response.message || '创建失败');
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deletePriceAlert(id);
    
    if (response.success) {
      toast.success('删除成功');
      loadData();
    } else {
      toast.error(response.message || '删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要删除的提醒');
      return;
    }

    const response = await deletePriceAlerts(selectedIds);
    
    if (response.success) {
      toast.success('批量删除成功');
      setSelectedIds([]);
      setEditMode(false);
      loadData();
    } else {
      toast.error(response.message || '批量删除失败');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const groupedNews = groupNews(news, alerts);
  const groupedEarnings = groupEarnings(earnings);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            价格提醒
          </h1>
          <p className="text-muted-foreground mt-2">
            设置股票价格提醒，及时把握投资机会
          </p>
        </div>
        
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setSelectedIds([]);
                }}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleBatchDelete}
                disabled={selectedIds.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除 ({selectedIds.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setEditMode(true)}
                disabled={alerts.length === 0}
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新建提醒
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="alerts">
            我的提醒 ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="news">
            相关新闻 ({news.length})
          </TabsTrigger>
          <TabsTrigger value="earnings">
            财报日历 ({earnings.length})
          </TabsTrigger>
        </TabsList>

        {/* 提醒列表 */}
        <TabsContent value="alerts">
          {alerts.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">暂无价格提醒</h3>
              <p className="text-muted-foreground mb-4">
                创建第一个价格提醒，开始追踪您关注的股票
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                创建提醒
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map(alert => (
                <Card key={alert.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {editMode && (
                      <Checkbox
                        checked={selectedIds.includes(alert.id)}
                        onCheckedChange={() => toggleSelect(alert.id)}
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {alert.symbol}
                        </h3>
                        <Badge variant="secondary">{alert.name}</Badge>
                        <Badge variant={alert.type === 'stock' ? 'default' : 'outline'}>
                          {alert.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>当前价格:</span>
                          <span className="font-semibold text-foreground">
                            ${formatNumber(alert.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {alert.condition === 'above' ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                          <span>目标价格:</span>
                          <span className="font-semibold text-foreground">
                            ${formatNumber(alert.targetPrice)}
                          </span>
                        </div>
                        
                        <div>
                          <span>创建时间: {formatDate(alert.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {alert.triggered && (
                        <Badge variant="success">已触发</Badge>
                      )}
                      
                      {!editMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(alert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 新闻列表 */}
        <TabsContent value="news">
          {news.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">暂无相关新闻</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNews).map(([symbol, items]) => (
                <div key={symbol}>
                  <h3 className="text-xl font-semibold mb-3">{symbol}</h3>
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <h4 className="font-semibold mb-2 hover:text-primary">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span>{formatDate(item.publishedAt)}</span>
                            {item.sentiment && (
                              <Badge variant={
                                item.sentiment === 'positive' ? 'success' :
                                item.sentiment === 'negative' ? 'destructive' :
                                'secondary'
                              }>
                                {item.sentiment}
                              </Badge>
                            )}
                          </div>
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 财报列表 */}
        <TabsContent value="earnings">
          {earnings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">暂无财报数据</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEarnings).map(([date, items]) => (
                <div key={date}>
                  <h3 className="text-xl font-semibold mb-3">{formatDate(date)}</h3>
                  <div className="grid gap-3">
                    {items.map((item, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">{item.symbol}</h4>
                              <span className="text-muted-foreground">{item.name}</span>
                              <Badge variant="outline">{item.time}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {item.eps_estimate && (
                                <div>
                                  <span className="text-muted-foreground">EPS预期:</span>
                                  <span className="ml-2 font-semibold">${item.eps_estimate}</span>
                                  {item.eps_actual && (
                                    <span className="ml-2">
                                      (实际: ${item.eps_actual})
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {item.revenue_estimate && (
                                <div>
                                  <span className="text-muted-foreground">营收预期:</span>
                                  <span className="ml-2 font-semibold">
                                    ${formatNumber(item.revenue_estimate)}
                                  </span>
                                  {item.revenue_actual && (
                                    <span className="ml-2">
                                      (实际: ${formatNumber(item.revenue_actual)})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 创建提醒弹窗 */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="创建价格提醒"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">股票代码</label>
            <StockSearchInput
              value={createForm.symbol}
              onChange={(symbol) => setCreateForm(prev => ({ ...prev, symbol }))}
              placeholder="输入股票代码"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">目标价格</label>
            <Input
              type="number"
              step="0.01"
              value={createForm.targetPrice}
              onChange={(e) => setCreateForm(prev => ({ ...prev, targetPrice: e.target.value }))}
              placeholder="输入目标价格"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">触发条件</label>
            <Select
              value={createForm.condition}
              onChange={(e) => setCreateForm(prev => ({ ...prev, condition: e.target.value as any }))}
            >
              <option value="above">高于目标价</option>
              <option value="below">低于目标价</option>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              取消
            </Button>
            <Button onClick={handleCreate}>
              创建
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PriceAlertPage;
