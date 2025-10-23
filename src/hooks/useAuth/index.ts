/**
 * useAuth Hook - 认证状态管理 Hook
 * 管理用户登录状态和认证信息
 */

import { useCallback, useEffect, useState } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
}

/**
 * 认证 Hook
 * @returns 认证状态和方法
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: true,
  });

  // 初始化认证状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setAuthState({
      isAuthenticated: !!token,
      token,
      user: user ? JSON.parse(user) : null,
      loading: false,
    });
  }, []);

  // 登录
  const login = useCallback((token: string, user?: any) => {
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    setAuthState({
      isAuthenticated: true,
      token,
      user,
      loading: false,
    });
  }, []);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
    });
    
    // 不导入history，避免循环依赖
    window.location.href = '/user/login';
  }, []);

  // 更新用户信息
  const updateUser = useCallback((user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState((prev) => ({ ...prev, user }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    updateUser,
  };
};

export default useAuth;
