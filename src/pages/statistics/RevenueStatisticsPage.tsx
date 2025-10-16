/**
 * 营收统计页面
 * 显示股票的营收历史数据和趋势分析
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNumber, formatPercent, formatDate } from '@/utils/format';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const RevenueStatisticsPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [period, setPeriod] = useState<'quarterly' | 'annual'>('quarterly');

  // 模拟数据
  const data = {
    latestRevenue: 5000000000,
    revenueGrowth: 18.5,
    expectedRevenue: 5200000000,
    grossMargin: 42.5,
    history: [
      { date: '2024-10-15', revenue: 5000000000, growth: 18.5, grossMargin: 42.5, netIncome: 1200000000 },
      { date: '2024-07-15', revenue: 4800000000, growth: 20.1, grossMargin: 41.8, netIncome: 1150000000 },
      { date: '2024-04-15', revenue: 4600000000, growth: 17.2, grossMargin: 42.0, netIncome: 1100000000 },
      { date: '2024-01-15', revenue: 4400000000, growth: 15.5, grossMargin: 41.5, netIncome: 1050000000 },
      { date: '2023-10-15', revenue: 4200000000, growth: 22.5, grossMargin: 41.0, netIncome: 1000000000 },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            营收统计 - {symbol}
          </h1>
          <p className="text-muted-foreground mt-2">
            查看历史营收数据和趋势分析
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={period === 'quarterly' ? 'default' : 'outline'}
            onClick={() => setPeriod('quarterly')}
          >
            季度
          </Button>
          <Button
            variant={period === 'annual' ? 'default' : 'outline'}
            onClick={() => setPeriod('annual')}
          >
            年度
          </Button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">最新营收</div>
          <div className="text-2xl font-bold">${formatNumber(data.latestRevenue / 1000000)}M</div>
          <div className={`text-sm flex items-center gap-1 ${
            data.revenueGrowth >= 0 ? 'text-success' : 'text-destructive'
          }`}>
            {data.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatPercent(Math.abs(data.revenueGrowth))} YoY
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">预期营收</div>
          <div className="text-2xl font-bold">${formatNumber(data.expectedRevenue / 1000000)}M</div>
          <div className="text-sm text-muted-foreground">
            下一期预期
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">毛利率</div>
          <div className="text-2xl font-bold">{formatPercent(data.grossMargin)}</div>
          <div className="text-sm text-muted-foreground">
            当前毛利率
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">年营收</div>
          <div className="text-2xl font-bold">
            ${formatNumber((data.latestRevenue * 4) / 1000000000, 1)}B
          </div>
          <div className="text-sm text-muted-foreground">
            TTM (过去12个月)
          </div>
        </Card>
      </div>

      {/* 营收历史表格 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">营收历史</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">日期</th>
                <th className="text-right py-3 px-4">营收</th>
                <th className="text-right py-3 px-4">同比增长</th>
                <th className="text-right py-3 px-4">毛利率</th>
                <th className="text-right py-3 px-4">净利润</th>
                <th className="text-right py-3 px-4">利润率</th>
              </tr>
            </thead>
            <tbody>
              {data.history.map((item, index) => {
                const profitMargin = (item.netIncome / item.revenue) * 100;
                
                return (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{formatDate(item.date)}</td>
                    <td className="text-right py-3 px-4 font-semibold">
                      ${formatNumber(item.revenue / 1000000)}M
                    </td>
                    <td className={`text-right py-3 px-4 ${
                      item.growth >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {formatPercent(item.growth)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {formatPercent(item.grossMargin)}
                    </td>
                    <td className="text-right py-3 px-4">
                      ${formatNumber(item.netIncome / 1000000)}M
                    </td>
                    <td className="text-right py-3 px-4">
                      {formatPercent(profitMargin)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 营收构成分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">收入来源</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">产品收入</span>
                <span className="text-sm font-semibold">65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">服务收入</span>
                <span className="text-sm font-semibold">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-secondary rounded-full h-2" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">其他收入</span>
                <span className="text-sm font-semibold">5%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent rounded-full h-2" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">地区分布</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">北美</span>
                <span className="text-sm font-semibold">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">欧洲</span>
                <span className="text-sm font-semibold">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-secondary rounded-full h-2" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">亚太</span>
                <span className="text-sm font-semibold">20%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent rounded-full h-2" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">其他地区</span>
                <span className="text-sm font-semibold">5%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-muted-foreground rounded-full h-2" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RevenueStatisticsPage;
