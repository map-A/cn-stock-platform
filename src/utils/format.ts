/**
 * 格式化工具函数
 */
import dayjs from 'dayjs';

/**
 * 格式化股票价格
 * @param price 价格
 * @param decimal 小数位数
 */
export const formatPrice = (price: number | undefined, decimal: number = 2): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return '--';
  }
  return price.toFixed(decimal);
};

/**
 * 格式化涨跌幅
 * @param percent 涨跌幅
 * @param withSign 是否显示正负号
 */
export const formatPercent = (percent: number | undefined, withSign: boolean = true): string => {
  if (percent === undefined || percent === null || isNaN(percent)) {
    return '--';
  }

  const sign = withSign && percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

/**
 * 格式化大数字
 * @param value 数值
 * @param unit 单位 (万, 亿)
 */
export const formatLargeNumber = (value: number | undefined, unit?: '万' | '亿'): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '--';
  }

  if (unit === '万') {
    return `${(value / 10000).toFixed(2)}万`;
  }

  if (unit === '亿') {
    return `${(value / 100000000).toFixed(2)}亿`;
  }

  // 自动选择单位
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(2)}亿`;
  }
  
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)}万`;
  }

  return value.toFixed(2);
};

/**
 * 格式化成交量
 * @param volume 成交量（手）
 */
export const formatVolume = (volume: number | undefined): string => {
  return formatLargeNumber(volume, '万');
};

/**
 * 格式化成交额
 * @param amount 成交额（元）
 */
export const formatAmount = (amount: number | undefined): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '--';
  }

  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(2)}亿`;
  }

  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}万`;
  }

  return amount.toFixed(2);
};

/**
 * 格式化市值
 * @param marketCap 市值（元）
 */
export const formatMarketCap = (marketCap: number | undefined): string => {
  return formatLargeNumber(marketCap, '亿');
};

/**
 * 格式化日期时间
 * @param date 日期
 * @param format 格式
 */
export const formatDate = (date: string | number | Date, format: string = 'YYYY-MM-DD'): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间（相对时间）
 * @param date 日期
 */
export const formatRelativeTime = (date: string | number | Date): string => {
  if (!date) {
    return '--';
  }

  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) {
    return '刚刚';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }

  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }

  if (diffDays < 7) {
    return `${diffDays}天前`;
  }

  return formatDate(date);
};

/**
 * 格式化股票代码
 * @param symbol 股票代码（如：600000.SH）
 * @param withExchange 是否包含交易所后缀
 */
export const formatSymbol = (symbol: string, withExchange: boolean = true): string => {
  if (!symbol) {
    return '--';
  }

  if (!withExchange && symbol.includes('.')) {
    return symbol.split('.')[0];
  }

  return symbol;
};

/**
 * 获取涨跌颜色
 * @param value 涨跌值
 */
export const getPriceColor = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '#666';
  }

  if (value > 0) {
    return '#f5222d'; // 红色（涨）
  }

  if (value < 0) {
    return '#52c41a'; // 绿色（跌）
  }

  return '#666'; // 灰色（平）
};

/**
 * 格式化比率
 * @param ratio 比率
 * @param decimal 小数位数
 */
export const formatRatio = (ratio: number | undefined, decimal: number = 2): string => {
  if (ratio === undefined || ratio === null || isNaN(ratio)) {
    return '--';
  }
  return ratio.toFixed(decimal);
};

/**
 * 格式化市盈率
 */
export const formatPE = (pe: number | undefined): string => {
  if (pe === undefined || pe === null || isNaN(pe) || pe < 0) {
    return '--';
  }
  return pe.toFixed(2);
};

/**
 * 格式化市净率
 */
export const formatPB = (pb: number | undefined): string => {
  if (pb === undefined || pb === null || isNaN(pb) || pb < 0) {
    return '--';
  }
  return pb.toFixed(2);
};

/**
 * 获取交易所名称
 * @param exchange 交易所代码
 */
export const getExchangeName = (exchange: string): string => {
  const exchangeMap: Record<string, string> = {
    SH: '上交所',
    SZ: '深交所',
    BJ: '北交所',
  };

  return exchangeMap[exchange] || exchange;
};

/**
 * 格式化数字（带千分位）
 * @param num 数字
 * @param decimal 小数位数
 */
export const formatNumber = (num: number | undefined, decimal: number = 0): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return '--';
  }

  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
};

/**
 * 格式化货币
 * @param amount 金额
 * @param decimal 小数位数
 */
export const formatCurrency = (amount: number | undefined, decimal: number = 2): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '--';
  }

  return `¥${formatNumber(amount, decimal)}`;
};

/**
 * 格式化时间
 * @param date 日期
 * @param format 格式
 */
export const formatTime = (date: string | number | Date, format: string = 'HH:mm:ss'): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 * @param date 日期
 * @param format 格式
 */
export const formatDateTime = (date: string | number | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).format(format);
};
