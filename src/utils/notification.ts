/**
 * 浏览器通知工具
 * Phase 5: 用户系统 - 推送通知
 */

import { message } from 'antd';
import { subscribePush, unsubscribePush } from '@/services/user';

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // 检查浏览器是否支持通知
  if (!('Notification' in window)) {
    console.warn('浏览器不支持通知功能');
    return false;
  }

  // 检查当前权限状态
  if (Notification.permission === 'granted') {
    return true;
  }

  // 请求权限
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('请求通知权限失败:', error);
    return false;
  }
}

/**
 * 发送通知
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions & { url?: string },
): Notification | null {
  // 只在授权后发送
  if (Notification.permission === 'granted') {
    const { url, ...notificationOptions } = options || {};

    const notification = new Notification(title, {
      icon: '/logo.png',
      ...notificationOptions,
    });

    // 点击通知后跳转
    if (url) {
      notification.onclick = () => {
        window.focus();
        window.location.href = url;
      };
    }

    return notification;
  }

  return null;
}

/**
 * 将 base64 字符串转换为 Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  // 添加填充
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * 订阅推送
 */
export async function subscribeUserToPush(): Promise<{ success: boolean }> {
  try {
    // 确保支持 Service Worker
    if (!('serviceWorker' in navigator)) {
      throw new Error('浏览器不支持 Service Worker');
    }

    // 注册 Service Worker（如果未注册）
    let registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      console.log('注册 Service Worker...');
      registration = await navigator.serviceWorker.register('/service-worker.js');
      // 等待激活
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 等待 Service Worker 就绪
    registration = await navigator.serviceWorker.ready;

    // 获取 VAPID 公钥（应该从环境变量或配置中获取）
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
    const vapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // 检查是否已订阅
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // 创建新订阅
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });
      console.log('创建新的推送订阅');
    } else {
      console.log('使用现有订阅');
    }

    // 发送订阅信息到服务器
    const result = await subscribePush(subscription);
    return result;
  } catch (error) {
    console.error('订阅推送失败:', error);
    message.error('订阅推送失败');
    return { success: false };
  }
}

/**
 * 取消推送订阅
 */
export async function unsubscribeFromPush(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.log('未找到 Service Worker 注册');
        return;
      }

      const readyRegistration = await navigator.serviceWorker.ready;
      const subscription = await readyRegistration.pushManager.getSubscription();

      if (subscription) {
        // 通知服务器取消订阅
        await unsubscribePush();
        // 取消本地订阅
        await subscription.unsubscribe();
        console.log('成功取消推送订阅');
        message.success('已取消推送通知');
      } else {
        console.log('未找到推送订阅');
      }
    } catch (error) {
      console.error('取消推送订阅失败:', error);
      message.error('取消推送订阅失败');
    }
  }
}

/**
 * 检查推送订阅状态
 */
export async function checkPushSubscriptionStatus(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    try {
      // 检查是否注册了 Service Worker
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return false;
      }

      // 等待就绪
      const readyRegistration = await navigator.serviceWorker.ready;
      const subscription = await readyRegistration.pushManager.getSubscription();

      return subscription !== null;
    } catch (error) {
      console.error('检查推送订阅状态失败:', error);
      return false;
    }
  }
  return false;
}

/**
 * 测试通知
 */
export function testNotification(): void {
  requestNotificationPermission().then((granted) => {
    if (granted) {
      sendNotification('测试通知', {
        body: '如果您看到这条通知，说明通知功能正常工作',
        icon: '/logo.png',
      });
      message.success('测试通知已发送');
    } else {
      message.warning('您未授权通知权限');
    }
  });
}
