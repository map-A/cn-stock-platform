/**
 * 盈利统计页面
 * 显示股票的盈利历史数据和趋势分析
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LineChart, BarChart } from '@/components/charts';
import { toast } from '@/utils/toast';
import { formatNumber, formatPercent, formatDate } from '@/utils/format';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface EarningsHistory {
  date: string;
  actualEPS: number;
  estimatedEPS: number;
  surprise: number;
  yoyGrowth: number;
  revenue: number;
}

export const EarningsStatisticsPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'quarterly' | 'annual'>('quarterly');

  // 模拟数据
  const data = {
    latestEPS: 1.25,
    expectedEPS: 1.30,
    epsGrowth: 15.5,
    surpriseRate: 2.8,
    nextEarningsDate: '2025-11-15',
    nextEarningsTime: 'After Market Close',
    epsHistory: [
      { date: 'Q1 2024', actual: 1.10, estimated: 1.05 },
      { date: 'Q2 2024', actual: 1.15, estimated: 1.12 },
      { date: 'Q3 2024', actual: 1.20, estimated: 1.18 },
      { date: 'Q4 2024', actual: 1.25, estimated: 1.22 },
    ],
    epsGrowthHistory: [
      { date: 'Q1 2024', growth: 12.5 },
      { date: 'Q2 2024', growth: 14.2 },
      { date: 'Q3 2024', growth: 16.1 },
      { date: 'Q4 2024', growth: 15.5 },
    ],
    history: [
      { date: '2024-10-15', actualEPS: 1.25, estimatedEPS: 1.22, surprise: 2.46, yoyGrowth: 15.5, revenue: 5000000000 },
      { date: '2024-07-15', actualEPS: 1.20, estimatedEPS: 1.18, surprise: 1.69, yoyGrowth: 16.1, revenue: 4800000000 },
      { date: '2024-04-15', actualEPS: 1.15, estimatedEPS: 1.12, surprise: 2.68, yoyGrowth: 14.2, revenue: 4600000000 },
      { date: '2024-01-15', actualEPS: 1.10, estimatedEPS: 1.05, surprise: 4.76, yoyGrowth: 12.5, revenue: 4400000000 },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            盈利统计 - {symbol}
          </h1>
          <p className="text-muted-foreground mt-2">
            查看历史盈利数据和趋势分析
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
          <div className="text-sm text-muted-foreground mb-1">最新EPS</div>
          <div className="text-2xl font-bold">${formatNumber(data.latestEPS)}</div>
          <div className={`text-sm flex items-center gap-1 ${
            data.epsGrowth >= 0 ? 'text-success' : 'text-destructive'
          }`}>
            {data.epsGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatPercent(Math.abs(data.epsGrowth))} YoY
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">预期EPS</div>
          <div className="text-2xl font-bold">${formatNumber(data.expectedEPS)}</div>
          <div className="text-sm text-muted-foreground">
            下一期预期
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">惊喜率</div>
          <div className="text-2xl font-bold">{formatPercent(data.surpriseRate)}</div>
          <div className="text-sm text-muted-foreground">
            平均超预期幅度
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">下次财报</div>
          <div className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {formatDate(data.nextEarningsDate)}
          </div>
          <Badge variant="outline" className="mt-1">
            {data.nextEarningsTime}
          </Badge>
        </Card>
      </div>

      {/* 历史数据表格 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">盈利历史</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">日期</th>
                <th className="text-right py-3 px-4">实际EPS</th>
                <th className="text-right py-3 px-4">预期EPS</th>
                <th className="text-right py-3 px-4">差异</th>
                <th className="text-right py-3 px-4">同比增长</th>
                <th className="text-right py-3 px-4">营收</th>
              </tr>
            </thead>
            <tbody>
              {data.history.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{formatDate(item.date)}</td>
                  <td className="text-right py-3 px-4 font-semibold">
                    ${formatNumber(item.actualEPS)}
                  </td>
                  <td className="text-right py-3 px-4">
                    ${formatNumber(item.estimatedEPS)}
                  </td>
                  <td className={`text-right py-3 px-4 ${
                    item.surprise >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {formatPercent(item.surprise)}
                  </td>
                  <td className={`text-right py-3 px-4 ${
                    item.yoyGrowth >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {formatPercent(item.yoyGrowth)}
                  </td>
                  <td className="text-right py-3 px-4">
                    ${formatNumber(item.revenue / 1000000)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EarningsStatisticsPage;
