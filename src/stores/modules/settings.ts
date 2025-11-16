import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayoutSettings {
  background: {
    type: 'solid' | 'gradient';
    color: string;
  };
  gridLines: {
    type: 'both' | 'vertical' | 'horizontal' | 'none';
    verticalColor: string;
    horizontalColor: string;
  };
  crosshair: {
    color: string;
  };
  watermark: {
    items: string[];
    color: string;
  };
  scales: {
    textColor: string;
    fontSize: string;
    lineColor: string;
  };
  buttons: {
    navigation: 'hover' | 'always' | 'never';
    pane: 'hover' | 'always' | 'never';
  };
  margins: {
    top: number;
    bottom: number;
    right: number;
  };
}

export interface ChartSettings {
  // 商品代码设置
  candleColorBasedOnPreviousClose: boolean;
  candleBody: boolean;
  candleBodyUpColor: string;
  candleBodyDownColor: string;
  candleBorder: boolean;
  candleBorderUpColor: string;
  candleBorderDownColor: string;
  candleWick: boolean;
  candleWickUpColor: string;
  candleWickDownColor: string;
  session: 'regular' | 'extended';
  adjustForDividends: boolean;
  precision: 'auto' | '2' | '4' | '6';
  timezone: string;

  // 状态行设置
  showLogo: boolean;
  showTitle: boolean;
  description: 'full' | 'short' | 'none';
  showMarketStatus: boolean;
  showOHLC: boolean;
  showBarChange: boolean;
  showVolume: boolean;
  showLastDayChange: boolean;
  indicatorTitle: boolean;
  indicatorInputs: boolean;
  indicatorValues: boolean;
  indicatorBackground: boolean;

  // 图表基本样式
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient';
  gridLinesType: 'vh' | 'v' | 'h' | 'none';
  gridLineColor: string;
  crosshairColor: string;
  watermarkType: 'replay' | 'symbol' | 'none';
  watermarkColor: string;
  scaleTextColor: string;
  scaleFontSize: string;
  scaleLineColor: string;
  navigationButtonVisibility: 'hover' | 'always' | 'never';
  paneButtonVisibility: 'hover' | 'always' | 'never';
  marginTop: number;
  marginBottom: number;
  marginRight: number;

  // 版面设置（新结构化配置）
  layout: LayoutSettings;

  // 版面设置（旧配置，保持兼容）
  theme: 'dark' | 'light' | 'auto';
  candleUpColor: string;
  candleDownColor: string;
  volumeUpColor: string;
  volumeDownColor: string;
  showTopToolbar: boolean;
  showLeftToolbar: boolean;
  showRightPanel: boolean;
  showBottomPanel: boolean;
  showBottomToolbar: boolean;
  mouseWheelAction: 'zoom' | 'scroll';

  // 交易设置
  showTradingPanel: boolean;
  confirmOrders: boolean;
  showPositions: boolean;
  showOrders: boolean;
  showExecutions: boolean;
  playSound: boolean;

  // 警报设置
  showAlertDialog: boolean;
  playAlertSound: boolean;
  showAlertsOnChart: boolean;
  defaultFrequency: 'once' | 'oncebar' | 'every';
  defaultExpiry: '1hour' | '1day' | '1week' | '1month' | 'never';

  // 事件设置
  showIdeas: boolean;
  showDividends: boolean;
  showSplits: boolean;
  showEarnings: boolean;
  showEarningsRange: boolean;
  showTradingDayRange: boolean;
  showLatestNews: boolean;
  showNewsNotifications: boolean;
}

interface SettingsState {
  settings: ChartSettings;
  updateSettings: (settings: Partial<ChartSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: ChartSettings = {
  // 商品代码设置
  candleColorBasedOnPreviousClose: false,
  candleBody: true,
  candleBodyUpColor: '#089981',
  candleBodyDownColor: '#F23645',
  candleBorder: true,
  candleBorderUpColor: '#089981',
  candleBorderDownColor: '#F23645',
  candleWick: true,
  candleWickUpColor: '#089981',
  candleWickDownColor: '#F23645',
  session: 'regular',
  adjustForDividends: false,
  precision: 'auto',
  timezone: 'Asia/Shanghai',

  // 状态行设置
  showLogo: true,
  showTitle: true,
  description: 'full',
  showMarketStatus: true,
  showOHLC: true,
  showBarChange: true,
  showVolume: false,
  showLastDayChange: false,
  indicatorTitle: true,
  indicatorInputs: true,
  indicatorValues: true,
  indicatorBackground: true,

  // 图表基本样式
  backgroundColor: '#131722',
  backgroundType: 'solid',
  gridLinesType: 'vh',
  gridLineColor: '#363A45',
  crosshairColor: '#758696',
  watermarkType: 'replay',
  watermarkColor: '#787B86',
  scaleTextColor: '#D1D4DC',
  scaleFontSize: '12',
  scaleLineColor: '#2A2E39',
  navigationButtonVisibility: 'hover',
  paneButtonVisibility: 'hover',
  marginTop: 10,
  marginBottom: 8,
  marginRight: 10,

  // 版面设置（新结构化配置）
  layout: {
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    gridLines: {
      type: 'both',
      verticalColor: '#D1D4DC',
      horizontalColor: '#D1D4DC',
    },
    crosshair: {
      color: '#9598A1',
    },
    watermark: {
      items: ['replay'],
      color: '#787B86',
    },
    scales: {
      textColor: '#787B86',
      fontSize: '12',
      lineColor: '#787B86',
    },
    buttons: {
      navigation: 'hover',
      pane: 'hover',
    },
    margins: {
      top: 10,
      bottom: 8,
      right: 10,
    },
  },

  // 版面设置（旧配置，保持兼容）
  theme: 'dark',
  candleUpColor: '#089981',
  candleDownColor: '#F23645',
  volumeUpColor: '#089981',
  volumeDownColor: '#F23645',
  showTopToolbar: true,
  showLeftToolbar: true,
  showRightPanel: true,
  showBottomPanel: false,
  showBottomToolbar: true,
  mouseWheelAction: 'zoom',

  // 交易设置
  showTradingPanel: true,
  confirmOrders: true,
  showPositions: true,
  showOrders: true,
  showExecutions: true,
  playSound: true,

  // 警报设置
  showAlertDialog: true,
  playAlertSound: true,
  showAlertsOnChart: true,
  defaultFrequency: 'once',
  defaultExpiry: '1day',

  // 事件设置
  showIdeas: false,
  showDividends: true,
  showSplits: true,
  showEarnings: true,
  showEarningsRange: false,
  showTradingDayRange: false,
  showLatestNews: true,
  showNewsNotifications: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'chart-settings-storage',
    },
  ),
);
