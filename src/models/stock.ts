/**
 * 股票状态管理
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StockQuote, StockInfo } from '@/typings/stock';

interface StockState {
  // 当前选中的股票代码
  currentSymbol: string;
  // 实时行情数据
  realtimeQuote: StockQuote | null;
  // 股票基本信息
  stockInfo: StockInfo | null;
  // 市场状态
  isMarketOpen: boolean;
  // 价格变化趋势
  priceIncreasing: boolean;

  // Actions
  setCurrentSymbol: (symbol: string) => void;
  updateRealtimeQuote: (quote: StockQuote) => void;
  setStockInfo: (info: StockInfo) => void;
  setMarketStatus: (isOpen: boolean) => void;
  setPriceTrend: (isIncreasing: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentSymbol: '',
  realtimeQuote: null,
  stockInfo: null,
  isMarketOpen: false,
  priceIncreasing: false,
};

export const useStockStore = create<StockState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentSymbol: (symbol) => {
          set({ currentSymbol: symbol }, false, 'setCurrentSymbol');
        },

        updateRealtimeQuote: (quote) => {
          set((state) => {
            const priceIncreasing =
              state.realtimeQuote && quote.price > state.realtimeQuote.price;
            return {
              realtimeQuote: quote,
              priceIncreasing: Boolean(priceIncreasing),
            };
          }, false, 'updateRealtimeQuote');
        },

        setStockInfo: (info) => {
          set({ stockInfo: info }, false, 'setStockInfo');
        },

        setMarketStatus: (isOpen) => {
          set({ isMarketOpen: isOpen }, false, 'setMarketStatus');
        },

        setPriceTrend: (isIncreasing) => {
          set({ priceIncreasing: isIncreasing }, false, 'setPriceTrend');
        },

        reset: () => {
          set(initialState, false, 'reset');
        },
      }),
      {
        name: 'stock-storage',
        partialize: (state) => ({
          currentSymbol: state.currentSymbol,
        }),
      },
    ),
    { name: 'StockStore' },
  ),
);

/**
 * 获取市场交易状态
 * 交易时间: 9:30-11:30, 13:00-15:00 (周一至周五)
 */
export const getMarketStatus = (): boolean => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 周末不交易
  if (day === 0 || day === 6) {
    return false;
  }

  // 上午: 9:30-11:30
  const morningStart = hours === 9 && minutes >= 30;
  const morningEnd = hours === 11 && minutes <= 30;
  const morningSession = (hours === 9 && morningStart) || hours === 10 || (hours === 11 && morningEnd);

  // 下午: 13:00-15:00
  const afternoonSession = hours === 13 || hours === 14;

  return morningSession || afternoonSession;
};
