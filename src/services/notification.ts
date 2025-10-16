/**
 * 通知服务
 * 处理用户通知的查询、更新和设置
 */

import type { ApiResponse } from '@/types/api';

export interface Notification {
  id: string;
  userId: string;
  type: 'priceAlert' | 'earnings' | 'news' | 'dividend' | 'filing' | 'system';
  title: string;
  content: string;
  symbol?: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  priceAlert: boolean;
  earnings: boolean;
  news: boolean;
  dividend: boolean;
  filing: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
}

/**
 * 获取用户通知列表
 */
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<ApiResponse<Notification[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');

    const response = await fetch(`/api/notifications?${queryParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('获取通知失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取通知错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取通知失败',
    };
  }
}

/**
 * 获取未读通知数量
 */
export async function getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
  try {
    const response = await fetch('/api/notifications/unread-count', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('获取未读通知数量失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取未读通知数量错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取未读通知数量失败',
    };
  }
}

/**
 * 标记通知为已读
 */
export async function markAsRead(ids: string[]): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error('标记已读失败');
    }

    return await response.json();
  } catch (error) {
    console.error('标记已读错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '标记已读失败',
    };
  }
}

/**
 * 标记所有通知为已读
 */
export async function markAllAsRead(): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('标记所有已读失败');
    }

    return await response.json();
  } catch (error) {
    console.error('标记所有已读错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '标记所有已读失败',
    };
  }
}

/**
 * 删除通知
 */
export async function deleteNotification(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('删除通知失败');
    }

    return await response.json();
  } catch (error) {
    console.error('删除通知错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除通知失败',
    };
  }
}

/**
 * 批量删除通知
 */
export async function deleteNotifications(ids: string[]): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/notifications/batch', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error('批量删除通知失败');
    }

    return await response.json();
  } catch (error) {
    console.error('批量删除通知错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '批量删除通知失败',
    };
  }
}

/**
 * 获取通知设置
 */
export async function getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
  try {
    const response = await fetch('/api/notifications/settings', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('获取通知设置失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取通知设置错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取通知设置失败',
    };
  }
}

/**
 * 更新通知设置
 */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
): Promise<ApiResponse<NotificationSettings>> {
  try {
    const response = await fetch('/api/notifications/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('更新通知设置失败');
    }

    return await response.json();
  } catch (error) {
    console.error('更新通知设置错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新通知设置失败',
    };
  }
}
