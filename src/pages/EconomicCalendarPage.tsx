/**
 * 经济日历页面
 * 显示重要经济事件和数据发布时间表
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDate, formatTime } from '@/utils/format';
import { Calendar, TrendingUp, Globe, AlertCircle, Star } from 'lucide-react';

interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  country: string;
  importance: 'high' | 'medium' | 'low';
  actual?: number | string;
  forecast?: number | string;
  previous?: number | string;
  currency: string;
}

export const EconomicCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useEffect(() => {
    filterEvents();
  }, [events, importanceFilter, countryFilter]);

  const loadData = async () => {
    setLoading(true);
    
    // 模拟数据
    const mockEvents: EconomicEvent[] = [
      {
        id: '1',
        date: selectedDate,
        time: '08:30',
        event: '非农就业人数',
        country: '美国',
        importance: 'high',
        actual: 200000,
        forecast: 185000,
        previous: 175000,
        currency: 'USD',
      },
      {
        id: '2',
        date: selectedDate,
        time: '09:15',
        event: 'CPI同比',
        country: '美国',
        importance: 'high',
        forecast: '3.2%',
        previous: '3.1%',
        currency: 'USD',
      },
      {
        id: '3',
        date: selectedDate,
        time: '10:00',
        event: 'PMI制造业',
        country: 'cn',
        importance: 'medium',
        actual: 51.2,
        forecast: 50.8,
        previous: 50.5,
        currency: 'CNY',
      },
      {
        id: '4',
        date: selectedDate,
        time: '14:00',
        event: 'GDP季率',
        country: '欧元区',
        importance: 'high',
        forecast: '0.4%',
        previous: '0.3%',
        currency: 'EUR',
      },
      {
        id: '5',
        date: selectedDate,
        time: '14:30',
        event: 'FOMC会议纪要',
        country: '美国',
        importance: 'high',
        currency: 'USD',
      },
    ];
    
    setEvents(mockEvents);
    setLoading(false);
  };

  const filterEvents = () => {
    let filtered = [...events];
    
    if (importanceFilter !== 'all') {
      filtered = filtered.filter(e => e.importance === importanceFilter);
    }
    
    if (countryFilter !== 'all') {
      filtered = filtered.filter(e => e.country === countryFilter);
    }
    
    setFilteredEvents(filtered);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          经济日历
        </h1>
        <p className="text-muted-foreground mt-2">
          追踪全球重要经济事件和数据发布
        </p>
      </div>

      {/* 筛选器 */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">日期</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">重要性</label>
            <Select
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">国家/地区</label>
            <Select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="美国">美国</option>
              <option value="cn">cn</option>
              <option value="欧元区">欧元区</option>
              <option value="日本">日本</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* 快速日期导航 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[-2, -1, 0, 1, 2, 3, 4].map(offset => {
          const date = new Date();
          date.setDate(date.getDate() + offset);
          const dateStr = date.toISOString().split('T')[0];
          const isToday = offset === 0;
          
          return (
            <Button
              key={offset}
              variant={selectedDate === dateStr ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDate(dateStr)}
              className="flex-shrink-0"
            >
              {isToday ? '今天' : formatDate(dateStr, 'MM-DD')}
            </Button>
          );
        })}
      </div>

      {/* 事件列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">暂无事件</h3>
          <p className="text-muted-foreground">
            所选日期没有符合条件的经济事件
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map(event => (
            <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* 时间 */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-2xl font-bold">{event.time}</div>
                  <div className="text-xs text-muted-foreground">{event.currency}</div>
                </div>
                
                {/* 事件详情 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{event.event}</h3>
                      <Badge variant={getImportanceColor(event.importance)}>
                        {getImportanceLabel(event.importance)}
                      </Badge>
                      <Badge variant="outline">
                        <Globe className="w-3 h-3 mr-1" />
                        {event.country}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* 数据值 */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">实际值</div>
                      <div className={`font-semibold ${
                        event.actual ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {event.actual || '--'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">预测值</div>
                      <div className="font-semibold">
                        {event.forecast || '--'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">前值</div>
                      <div className="font-semibold">
                        {event.previous || '--'}
                      </div>
                    </div>
                  </div>
                  
                  {/* 影响提示 */}
                  {event.importance === 'high' && event.actual && event.forecast && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span className="text-muted-foreground">
                        {typeof event.actual === 'number' && typeof event.forecast === 'number' ? (
                          event.actual > event.forecast ? (
                            <span className="text-success">
                              超预期 ({((event.actual - event.forecast) / event.forecast * 100).toFixed(1)}%)
                            </span>
                          ) : (
                            <span className="text-destructive">
                              低于预期 ({((event.actual - event.forecast) / event.forecast * 100).toFixed(1)}%)
                            </span>
                          )
                        ) : null}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 说明 */}
      <Card className="p-4 mt-6">
        <h3 className="font-semibold mb-3">重要性说明</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">高</Badge>
            <span className="text-muted-foreground">
              对市场影响重大，可能引发显著波动
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">中</Badge>
            <span className="text-muted-foreground">
              对市场有一定影响，值得关注
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">低</Badge>
            <span className="text-muted-foreground">
              影响相对较小，可作参考
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EconomicCalendarPage;
