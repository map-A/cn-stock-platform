/**
 * 开发环境状态持久化工具
 * 解决热重载时登录状态丢失问题
 */

const isDev = process.env.NODE_ENV === 'development';

export const DevStorage = {
  // 保存用户登录状态
  saveLoginState: (token: string, userInfo: any) => {
    if (isDev) {
      // 开发环境双重保存，确保热重载时不丢失
      sessionStorage.setItem('dev_token', token);
      sessionStorage.setItem('dev_userInfo', JSON.stringify(userInfo));
      sessionStorage.setItem('dev_loginTime', Date.now().toString());
    }
    
    // 正常保存
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
    if (userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  },

  // 获取保存的登录状态
  getLoginState: () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const userInfo = sessionStorage.getItem('userInfo');
    
    if (isDev) {
      // 开发环境优先使用dev_前缀的数据
      const devToken = sessionStorage.getItem('dev_token');
      const devUserInfo = sessionStorage.getItem('dev_userInfo');
      const devLoginTime = sessionStorage.getItem('dev_loginTime');
      
      // 检查开发环境登录状态是否在24小时内
      if (devToken && devUserInfo && devLoginTime) {
        const loginTime = parseInt(devLoginTime);
        const now = Date.now();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          console.log(`开发环境恢复登录状态，已登录 ${hoursDiff.toFixed(1)} 小时`);
          return {
            token: devToken,
            userInfo: JSON.parse(devUserInfo)
          };
        }
      }
    }
    
    return {
      token,
      userInfo: userInfo ? JSON.parse(userInfo) : null
    };
  },

  // 清除登录状态
  clearLoginState: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    
    if (isDev) {
      sessionStorage.removeItem('dev_token');
      sessionStorage.removeItem('dev_userInfo');
      sessionStorage.removeItem('dev_loginTime');
    }
  },

  // 检查是否有有效的登录状态
  hasValidLoginState: () => {
    const { token } = DevStorage.getLoginState();
    return !!token;
  }
};

export default DevStorage;
