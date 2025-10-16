/**
 * 分红日历页面
 * 显示股票分红事件和时间表
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate, formatNumber } from '@/utils/format';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DividendEvent {
  id: string;
  symbol: string;
  name: string;
  exDate: string;
  paymentDate: string;
  recordDate: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  yield: number;
  type: 'stock' | 'etf';
}

export const DividendCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<DividendEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DividendEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    
    // 模拟数据
    const mockEvents: DividendEvent[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: '苹果公司',
        exDate: '2025-11-08',
        paymentDate: '2025-11-15',
        recordDate: '2025-11-11',
        amount: 0.24,
        frequency: 'Quarterly',
        yield: 0.52,
        type: 'stock',
      },
      {
        id: '2',
        symbol: 'MSFT',
        name: '微软公司',
        exDate: '2025-11-20',
        paymentDate: '2025-12-12',
        recordDate: '2025-11-21',
        amount: 0.75,
        frequency: 'Quarterly',
        yield: 0.78,
        type: 'stock',
      },
      {
        id: '3',
        symbol: 'SCHD',
        name: 'Schwab U.S. Dividend Equity ETF',
        exDate: '2025-11-25',
        paymentDate: '2025-11-28',
        recordDate: '2025-11-26',
        amount: 0.65,
        frequency: 'Quarterly',
        yield: 3.45,
        type: 'etf',
      },
      {
        id: '4',
        symbol: 'JNJ',
        name: '强生公司',
        exDate: '2025-11-26',
        paymentDate: '2025-12-10',
        recordDate: '2025-11-27',
        amount: 1.19,
        frequency: 'Quarterly',
        yield: 3.12,
        type: 'stock',
      },
      {
        id: '5',
        symbol: 'O',
        name: 'Realty Income',
        exDate: '2025-11-01',
        paymentDate: '2025-11-15',
        recordDate: '2025-11-02',
        amount: 0.263,
        frequency: 'Monthly',
        yield: 5.45,
        type: 'stock',
      },
    ];
    
    setEvents(mockEvents);
    setLoading(false);
  };

  const filterEvents = () => {
    let filtered = events;
    
    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  };

  const handleStockClick = (symbol: string, type: string) => {
    navigate(`/${type}s/${symbol}`);
  };

  // 按除息日期分组
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = event.exDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, DividendEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          分红日历
        </h1>
        <p className="text-muted-foreground mt-2">
          追踪股票和ETF的分红派息时间表
        </p>
      </div>

      {/* 筛选器 */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">月份</label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">搜索</label>
            <Input
              type="text"
              placeholder="搜索股票代码或名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">本月分红</div>
          <div className="text-2xl font-bold">{filteredEvents.length}</div>
          <div className="text-sm text-muted-foreground">只股票/ETF</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">平均收益率</div>
          <div className="text-2xl font-bold">
            {(filteredEvents.reduce((sum, e) => sum + e.yield, 0) / filteredEvents.length || 0).toFixed(2)}%
          </div>
          <div className="text-sm text-muted-foreground">Dividend Yield</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">总分红金额</div>
          <div className="text-2xl font-bold">
            ${formatNumber(filteredEvents.reduce((sum, e) => sum + e.amount, 0))}
          </div>
          <div className="text-sm text-muted-foreground">Per Share</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">月度分红</div>
          <div className="text-2xl font-bold">
            {filteredEvents.filter(e => e.frequency === 'Monthly').length}
          </div>
          <div className="text-sm text-muted-foreground">Monthly Payers</div>
        </Card>
      </div>

      {/* 分红事件列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : sortedDates.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">暂无分红事件</h3>
          <p className="text-muted-foreground">
            所选月份没有符合条件的分红事件
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(date)}
              </h2>
              
              <div className="space-y-3">
                {groupedEvents[date].map(event => (
                  <Card
                    key={event.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleStockClick(event.symbol, event.type)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* 股票信息 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{event.symbol}</h3>
                          <span className="text-muted-foreground">{event.name}</span>
                          <Badge variant={event.type === 'stock' ? 'default' : 'secondary'}>
                            {event.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{event.frequency}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">除息日</div>
                            <div className="font-semibold">{formatDate(event.exDate)}</div>
                          </div>
                          
                          <div>
                            <div className="text-muted-foreground mb-1">登记日</div>
                            <div className="font-semibold">{formatDate(event.recordDate)}</div>
                          </div>
                          
                          <div>
                            <div className="text-muted-foreground mb-1">派息日</div>
                            <div className="font-semibold">{formatDate(event.paymentDate)}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 金额信息 */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-success" />
                          <span className="text-2xl font-bold text-success">
                            ${formatNumber(event.amount)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-end gap-1 text-sm">
                          <TrendingUp className="w-4 h-4 text-success" />
                          <span className="font-semibold">
                            {event.yield.toFixed(2)}%
                          </span>
                          <span className="text-muted-foreground">收益率</span>
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

      {/* 说明 */}
      <Card className="p-4 mt-6">
        <h3 className="font-semibold mb-3">重要日期说明</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">除息日 (Ex-Dividend Date):</span> 
            在此日期或之后买入股票的投资者无法获得本次分红
          </div>
          <div>
            <span className="font-semibold text-foreground">登记日 (Record Date):</span> 
            公司确定有权获得分红的股东名单的日期
          </div>
          <div>
            <span className="font-semibold text-foreground">派息日 (Payment Date):</span> 
            股东实际收到分红款项的日期
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DividendCalendarPage;
