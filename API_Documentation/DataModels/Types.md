# Data Models & Type Definitions

## User Models

### User
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'premium' | 'analyst' | 'admin' | 'superadmin';
  subscriptionLevel: 'free' | 'basic' | 'premium';
  emailVerified: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled: boolean;
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
  lastLoginAt?: ISO8601DateTime;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'zh';
  currency: 'CNY' | 'USD';
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  defaultWatchlist?: string;
  defaultPortfolio?: string;
}
```

### UserProfile
```typescript
interface UserProfile {
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    wechat?: string;
    linkedin?: string;
  };
  isPublic: boolean;
  followers: number;
  following: number;
  portfolioValue?: number;
  totalReturn?: number;
  winRate?: number;
}
```

---

## Stock Models

### StockQuote
```typescript
interface StockQuote {
  symbol: string;
  name: string;
  nameEn?: string;
  exchange: string;
  lastPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  volumeRatio: number;
  turnover: number;
  turnoverRate: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  pe?: number;
  pb?: number;
  dividend?: number;
  yieldRate?: number;
  timestamp: ISO8601DateTime;
  status: 'TRADING' | 'HALT' | 'CLOSED' | 'DELISTED';
}
```

### StockInfo
```typescript
interface StockInfo {
  symbol: string;
  name: string;
  nameEn?: string;
  exchange: string;
  market: 'A' | 'HK' | 'US';
  sector: string;
  industry: string;
  listDate: date;
  totalShares: number;
  circulatingShares: number;
  marketCap: number;
  website?: string;
  description?: string;
  chairman?: string;
  generalManager?: string;
}
```

### StockChart / Candle
```typescript
interface Candle {
  timestamp: ISO8601DateTime;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
  vwap?: number;
}

interface StockChart {
  symbol: string;
  period: string;
  interval: string;
  candles: Candle[];
  startTime: ISO8601DateTime;
  endTime: ISO8601DateTime;
}
```

### FinancialMetrics
```typescript
interface FinancialMetrics {
  symbol: string;
  reportDate: date;
  reportType: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY';
  revenue: number;
  netProfit: number;
  eps: number;
  roe: number;
  roa: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  operatingMargin: number;
  grossMargin: number;
  assetTurnaroundRatio?: number;
  inventory?: number;
  accountsPayable?: number;
}
```

### ShareholderInfo
```typescript
interface ShareholderInfo {
  rank: number;
  name: string;
  type: 'Individual' | 'Institutional';
  shares: number;
  percentage: number;
  changePercent?: number;
  changeShares?: number;
  status?: 'add' | 'reduce' | 'unknown';
}
```

---

## Portfolio Models

### Portfolio
```typescript
interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  currency: string;
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  returnPercent: number;
  cash: number;
  holdings: Holding[];
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
  isDefault: boolean;
}
```

### Holding
```typescript
interface Holding {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  purchaseDate: ISO8601DateTime;
  weight: number;
  notes?: string;
  transactions: Transaction[];
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  portfolioId: string;
  holdingId?: string;
  type: 'buy' | 'sell' | 'dividend' | 'commission' | 'deposit' | 'withdrawal';
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  commission?: number;
  totalAmount: number;
  date: ISO8601DateTime;
  notes?: string;
}
```

### PortfolioMetrics
```typescript
interface PortfolioMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  averageDrawdown: number;
  winRate: number;
  profitFactor: number;
  recoveryFactor: number;
  exposureTime: number;
}
```

---

## Strategy Models

### Strategy
```typescript
interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'technical' | 'fundamental' | 'quantitative' | 'hybrid';
  status: 'draft' | 'active' | 'inactive' | 'archived';
  parameters: Parameter[];
  riskManagement: RiskManagement;
  rules: Rule[];
  backtestResults?: BacktestSummary;
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
  isPublic: boolean;
  version: number;
  tags: string[];
  subscribers?: number;
}

interface Parameter {
  name: string;
  type: 'integer' | 'number' | 'string' | 'boolean';
  value: any;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: any[];
}

interface RiskManagement {
  stopLoss?: number;
  takeProfit?: number;
  maxPosition?: number;
  maxDrawdown?: number;
  trailingStop?: boolean;
  trailingStopPercent?: number;
}

interface Rule {
  id: string;
  trigger: string;
  action: 'buy' | 'sell' | 'hold' | 'close';
  quantity: string | number;
  weight?: number;
  comment?: string;
}
```

### Backtest
```typescript
interface Backtest {
  id: string;
  userId: string;
  strategyId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  symbols: string[];
  startDate: date;
  endDate: date;
  initialCapital: number;
  slippage: number;
  commission: number;
  parameters: Record<string, any>;
  summary?: BacktestSummary;
  createdAt: ISO8601DateTime;
  completedAt?: ISO8601DateTime;
}

interface BacktestSummary {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
  sortinoRatio: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  recoveryFactor: number;
  payoffRatio: number;
}

interface BacktestTrade {
  id: string;
  date: ISO8601DateTime;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  amount: number;
  commission: number;
  signal: string;
  profit?: number;
  profitPercent?: number;
}
```

---

## Watchlist Models

### Watchlist
```typescript
interface Watchlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
  stockCount: number;
  isDefault: boolean;
  isPublic: boolean;
}
```

### WatchlistItem
```typescript
interface WatchlistItem {
  id: string;
  watchlistId: string;
  symbol: string;
  name: string;
  addedPrice: number;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  addedAt: ISO8601DateTime;
  notes?: string;
}
```

---

## News Models

### News
```typescript
interface News {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  url: string;
  imageUrl?: string;
  category: 'market' | 'stock' | 'industry' | 'announcement' | 'economic';
  importance: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  publishedAt: ISO8601DateTime;
  stocks: string[];
  tags: string[];
}
```

---

## Market Models

### MarketOverview
```typescript
interface MarketOverview {
  timestamp: ISO8601DateTime;
  indices: Index[];
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
  marketTrend: 'bullish' | 'bearish' | 'mixed';
  gainers: Stock[];
  decliners: Stock[];
}

interface Index {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
}
```

### Sentiment
```typescript
interface Sentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number;
  timestamp: ISO8601DateTime;
  indicators: {
    advanceDecline: AdvanceDeclineIndicator;
    volumeAnalysis: VolumeAnalysis;
    breadthIndicators: BreadthIndicators;
    optionsFlow?: OptionsFlow;
  };
  rsi?: number;
  macd?: string;
  stochastic?: number;
}
```

---

## Common Type Definitions

```typescript
type ISO8601DateTime = string; // "2024-10-26T15:30:00Z"
type date = string; // "2024-10-26"

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
  timestamp?: ISO8601DateTime;
}

interface PaginatedResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}

interface ApiError {
  code: number;
  message: string;
  details?: Record<string, string>;
  timestamp: ISO8601DateTime;
}
```

---

## Enums

```typescript
enum UserRole {
  Guest = 'guest',
  User = 'user',
  Premium = 'premium',
  Analyst = 'analyst',
  Admin = 'admin',
  SuperAdmin = 'superadmin'
}

enum SubscriptionLevel {
  Free = 'free',
  Basic = 'basic',
  Premium = 'premium'
}

enum Market {
  AShare = 'A',
  HongKong = 'HK',
  UnitedStates = 'US'
}

enum OrderType {
  Buy = 'buy',
  Sell = 'sell'
}

enum StrategyType {
  Technical = 'technical',
  Fundamental = 'fundamental',
  Quantitative = 'quantitative',
  Hybrid = 'hybrid'
}

enum TimeFrame {
  OneDay = '1d',
  FiveDay = '5d',
  OneMonth = '1m',
  ThreeMonth = '3m',
  SixMonth = '6m',
  OneYear = '1y',
  YearToDate = 'ytd',
  Max = 'max'
}
```
