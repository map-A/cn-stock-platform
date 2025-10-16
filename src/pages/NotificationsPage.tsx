/**
 * 通知中心页面
 * 显示用户的所有通知消息
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/utils/toast';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from '@/services/notification';
import { formatDate, formatTime } from '@/utils/format';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const iconClass = 'w-5 h-5';
  
  switch (type) {
    case 'priceAlert':
      return <TrendingUp className={iconClass} />;
    case 'earnings':
      return <Calendar className={iconClass} />;
    case 'news':
      return <FileText className={iconClass} />;
    case 'dividend':
      return <DollarSign className={iconClass} />;
    case 'filing':
      return <FileText className={iconClass} />;
    case 'system':
      return <Info className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayList, setDisplayList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // 设置无限滚动
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, displayList]);

  const loadData = async () => {
    setLoading(true);
    const response = await getNotifications({ limit: 20 });
    
    if (response.success && response.data) {
      setNotifications(response.data);
      setDisplayList(response.data.slice(0, 20));
      setHasMore(response.data.length > 20);
      
      // 自动标记为已读
      const unreadIds = response.data
        .filter(n => !n.read)
        .map(n => n.id);
      
      if (unreadIds.length > 0) {
        await markAsRead(unreadIds);
      }
    } else {
      toast.error(response.message || '加载失败');
    }
    
    setLoading(false);
  };

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    setTimeout(() => {
      const nextIndex = displayList.length;
      const newItems = notifications.slice(nextIndex, nextIndex + 25);
      
      if (newItems.length > 0) {
        setDisplayList(prev => [...prev, ...newItems]);
        setHasMore(nextIndex + newItems.length < notifications.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 300);
  }, [displayList, notifications, loadingMore, hasMore]);

  const handleMarkAllRead = async () => {
    const response = await markAllAsRead();
    
    if (response.success) {
      toast.success('全部标记为已读');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setDisplayList(prev => prev.map(n => ({ ...n, read: true })));
    } else {
      toast.error(response.message || '操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deleteNotification(id);
    
    if (response.success) {
      toast.success('删除成功');
      setNotifications(prev => prev.filter(n => n.id !== id));
      setDisplayList(prev => prev.filter(n => n.id !== id));
    } else {
      toast.error(response.message || '删除失败');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // 根据通知类型跳转到相应页面
    if (notification.symbol) {
      navigate(`/stocks/${notification.symbol}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            通知中心
          </h1>
          
          {displayList.some(n => !n.read) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              全部标记为已读
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground">
          在账户设置中个性化您的通知偏好
        </p>
      </div>

      {/* 通知列表 */}
      {displayList.length === 0 ? (
        <Card className="p-8 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">暂无通知</h3>
          <p className="text-muted-foreground">
            您的通知消息将显示在这里
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayList.map(notification => (
            <Card
              key={notification.id}
              className={`p-4 transition-all ${
                !notification.read
                  ? 'bg-primary/5 border-primary/20'
                  : ''
              } hover:shadow-md cursor-pointer`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  !notification.read
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <NotificationIcon type={notification.type} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold">
                      {notification.title}
                      {notification.symbol && (
                        <Badge variant="secondary" className="ml-2">
                          {notification.symbol}
                        </Badge>
                      )}
                    </h3>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(notification.createdAt)}</span>
                    <span>{formatTime(notification.createdAt)}</span>
                    
                    <Badge variant="outline" className="capitalize">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {/* 加载更多触发器 */}
          {hasMore && (
            <div ref={loadMoreRef} className="py-4 text-center">
              {loadingMore && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              )}
            </div>
          )}
          
          {!hasMore && displayList.length > 0 && (
            <div className="py-4 text-center text-muted-foreground text-sm">
              已加载全部通知
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
