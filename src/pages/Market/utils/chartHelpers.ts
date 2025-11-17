/**
 * ECharts 图表辅助函数
 */

import type { CandleData } from './mockData';

/**
 * 将 CandleData 转换为 ECharts K线图格式
 */
export function convertToOhlcData(data: CandleData[]) {
  const dateValues = data.map((d) => d.date.getTime());
  const openValues = data.map((d) => d.open);
  const highValues = data.map((d) => d.high);
  const lowValues = data.map((d) => d.low);
  const closeValues = data.map((d) => d.close);

  return {
    dateValues,
    openValues,
    highValues,
    lowValues,
    closeValues,
  };
}

/**
 * 将 CandleData 转换为 Volume 数据
 */
export function convertToVolumeData(data: CandleData[]) {
  const dateValues = data.map((d) => d.date.getTime());
  const volumeValues = data.map((d) => d.volume);

  return {
    dateValues,
    volumeValues,
  };
}

/**
 * 格式化数字
 */
export function formatNumber(value: number): string {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B';
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M';
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K';
  }
  return value.toFixed(2);
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 计算价格变化
 */
export function calculateChange(current: number, previous: number) {
  const change = current - previous;
  const changePercent = ((change / previous) * 100);
  return {
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
  };
}

/**
 * 获取涨跌颜色（中国市场：红涨绿跌）
 */
export function getPriceColor(change: number): string {
  return change >= 0 ? '#ef5350' : '#26a69a'; // 红涨绿跌
}

/**
 * 获取 ECharts 主题配置
 */
export function getChartTheme(isDark: boolean = false) {
  return {
    background: isDark ? '#1e1e1e' : '#ffffff',
    gridColor: isDark ? '#2a2a2a' : '#e0e0e0',
    textColor: isDark ? '#d4d4d4' : '#333333',
    axisColor: isDark ? '#3a3a3a' : '#cccccc',
    upColor: '#ef5350',   // 红色表示上涨
    downColor: '#26a69a', // 绿色表示下跌
  };
}
