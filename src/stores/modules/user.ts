/**
 * 用户状态管理
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  tier: 'Free' | 'Pro' | 'Premium';
  isPro: boolean;
  expiresAt?: string;
}

interface UserState {
  // 用户信息
  user: UserInfo | null;
  // 是否已登录
  isLoggedIn: boolean;
  // Token
  token: string | null;
  // 未读通知数
  unreadCount: number;

  // Actions
  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  setUnreadCount: (count: number) => void;
  logout: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
}

const initialState = {
  user: null,
  isLoggedIn: false,
  token: null,
  unreadCount: 0,
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) => {
          set(
            {
              user,
              isLoggedIn: Boolean(user),
            },
            false,
            'setUser',
          );
        },

        setToken: (token) => {
          set({ token }, false, 'setToken');
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
        },

        setUnreadCount: (count) => {
          set({ unreadCount: count }, false, 'setUnreadCount');
        },

        logout: () => {
          set(initialState, false, 'logout');
          localStorage.removeItem('token');
        },

        updateUserInfo: (info) => {
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...info } : null,
            }),
            false,
            'updateUserInfo',
          );
        },
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      },
    ),
    { name: 'UserStore' },
  ),
);
