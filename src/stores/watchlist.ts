import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import watchlistService, { type WatchlistDetail } from '@/services/watchlist';
import { message } from 'antd';

interface WatchlistState {
  watchlists: WatchlistDetail[];
  currentWatchlist: WatchlistDetail | null;
  loading: boolean;
  // Actions
  fetchWatchlists: () => Promise<void>;
  fetchWatchlistDetail: (id: number) => Promise<void>;
  createWatchlist: (name: string, description?: string) => Promise<boolean>;
  deleteWatchlist: (id: number) => Promise<boolean>;
  addStock: (watchlistId: number, symbol: string) => Promise<boolean>;
  removeStock: (watchlistId: number, symbol: string) => Promise<boolean>;
  setCurrentWatchlist: (watchlist: WatchlistDetail | null) => void;
  isStockInWatchlist: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  devtools(
    persist(
      (set, get) => ({
        watchlists: [],
        currentWatchlist: null,
        loading: false,

        fetchWatchlists: async () => {
          set({ loading: true });
          try {
            const response = await watchlistService.getWatchlists();
            if (response.success && response.data) {
              set({ watchlists: response.data });
            }
          } catch (error) {
            message.error('获取自选股列表失败');
            console.error(error);
          } finally {
            set({ loading: false });
          }
        },

        fetchWatchlistDetail: async (id: number) => {
          set({ loading: true });
          try {
            const response = await watchlistService.getWatchlistDetail(id);
            if (response.success && response.data) {
              set({ currentWatchlist: response.data });
            }
          } catch (error) {
            message.error('获取自选股详情失败');
            console.error(error);
          } finally {
            set({ loading: false });
          }
        },

        createWatchlist: async (name: string, description?: string) => {
          try {
            const response = await watchlistService.createWatchlist({ name, description });
            if (response.success && response.data) {
              await get().fetchWatchlists();
              message.success('创建自选股成功');
              return true;
            }
            return false;
          } catch (error) {
            message.error('创建自选股失败');
            console.error(error);
            return false;
          }
        },

        deleteWatchlist: async (id: number) => {
          try {
            const response = await watchlistService.deleteWatchlist(id);
            if (response.success) {
              await get().fetchWatchlists();
              message.success('删除自选股成功');
              return true;
            }
            return false;
          } catch (error) {
            message.error('删除自选股失败');
            console.error(error);
            return false;
          }
        },

        addStock: async (watchlistId: number, symbol: string) => {
          try {
            const response = await watchlistService.addStock(watchlistId, symbol);
            if (response.success) {
              await get().fetchWatchlistDetail(watchlistId);
              message.success('添加成功');
              return true;
            }
            return false;
          } catch (error) {
            message.error('添加股票失败');
            console.error(error);
            return false;
          }
        },

        removeStock: async (watchlistId: number, symbol: string) => {
          try {
            const response = await watchlistService.removeStock(watchlistId, symbol);
            if (response.success) {
              await get().fetchWatchlistDetail(watchlistId);
              message.success('移除成功');
              return true;
            }
            return false;
          } catch (error) {
            message.error('移除股票失败');
            console.error(error);
            return false;
          }
        },

        setCurrentWatchlist: (watchlist: WatchlistDetail | null) => {
          set({ currentWatchlist: watchlist });
        },

        isStockInWatchlist: (symbol: string) => {
          const { currentWatchlist } = get();
          if (!currentWatchlist) return false;
          return currentWatchlist.stocks.some((stock) => stock.symbol === symbol);
        },
      }),
      {
        name: 'watchlist-storage',
        partialize: (state) => ({
          watchlists: state.watchlists,
          currentWatchlist: state.currentWatchlist,
        }),
      },
    ),
    { name: 'WatchlistStore' },
  ),
);
