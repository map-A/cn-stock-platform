/**
 * 用户状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  membership?: 'free' | 'pro' | 'premium';
}

interface UserState {
  user: UserInfo | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },
      logout: () =>
        set({ user: null, token: null, isLoggedIn: false }, true),
    }),
    {
      name: 'user-storage',
    }
  )
);
