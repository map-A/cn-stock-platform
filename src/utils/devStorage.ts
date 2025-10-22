/**
 * Development storage utility
 */

interface LoginState {
  token: string;
  userInfo: any;
}

class DevStorage {
  private prefix = 'dev_';
  private loginStateKey = 'login_state';

  getItem(key: string): any {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch {
      console.warn('Failed to set item in localStorage:', key);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      console.warn('Failed to remove item from localStorage:', key);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      console.warn('Failed to clear localStorage');
    }
  }

  // 保存登录状态
  saveLoginState(token: string, userInfo: any): void {
    const loginState: LoginState = {
      token,
      userInfo,
    };
    this.setItem(this.loginStateKey, loginState);
  }

  // 获取登录状态
  getLoginState(): LoginState {
    const loginState = this.getItem(this.loginStateKey);
    return loginState || { token: '', userInfo: null };
  }

  // 清空登录状态
  clearLoginState(): void {
    this.removeItem(this.loginStateKey);
  }
}

export default new DevStorage();
