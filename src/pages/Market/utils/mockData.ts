/**
 * 生成模拟K线数据
 * 适用于中国股票市场
 */

export interface CandleData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * 生成模拟K线数据
 * @param count 数据条数
 * @param startDate 开始日期
 * @param basePrice 基准价格
 * @returns CandleData[]
 */
export function generateMockCandleData(
  count: number = 200,
  startDate: Date = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
  basePrice: number = 100
): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = basePrice;
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    // 跳过周末
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // 模拟价格波动
    const trend = Math.sin(i / 10) * 5; // 长期趋势
    const noise = (Math.random() - 0.5) * 3; // 短期波动
    const change = trend + noise;

    currentPrice = Math.max(currentPrice + change, basePrice * 0.5);

    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * 4;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(Math.random() * 1000000 + 500000);

    data.push({
      date: new Date(currentDate),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return data;
}

/**
 * 生成中国A股模拟数据
 * @param symbol 股票代码
 * @returns CandleData[]
 */
export function generateChinaStockData(symbol: string): CandleData[] {
  // 根据不同股票代码生成不同的基准价格
  const basePrices: Record<string, number> = {
    '600519': 1680, // 贵州茅台
    '000001': 12.5,  // 平安银行
    '600036': 32.8,  // 招商银行
    '601318': 39.6,  // 中国平安
    '000333': 59.8,  // 美的集团
  };

  const basePrice = basePrices[symbol] || 50;
  return generateMockCandleData(200, undefined, basePrice);
}

/**
 * 生成实时更新的K线数据（模拟）
 * @param lastCandle 最后一根K线
 * @returns CandleData
 */
export function generateRealtimeUpdate(lastCandle: CandleData): CandleData {
  const now = new Date();
  const change = (Math.random() - 0.5) * 2;
  const close = lastCandle.close + change;
  const high = Math.max(lastCandle.high, close + Math.random());
  const low = Math.min(lastCandle.low, close - Math.random());
  const volume = lastCandle.volume + Math.floor(Math.random() * 100000);

  return {
    date: now,
    open: lastCandle.open,
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume,
  };
}

/**
 * 生成指数模拟数据
 */
export function generateIndexData(symbol: string): CandleData[] {
  const basePrices: Record<string, number> = {
    '000001': 3100, // 上证指数
    '399001': 9500, // 深证成指
    '399006': 2100, // 创业板指
  };

  const basePrice = basePrices[symbol] || 3000;
  return generateMockCandleData(200, undefined, basePrice);
}
