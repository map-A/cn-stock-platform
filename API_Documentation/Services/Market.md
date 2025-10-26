# Market Analysis & News Service API

## Overview
Provides market data analysis, sentiment tracking, news flow, and China-specific market features.

## Market Data Endpoints

### 1. Get Market Overview
**GET** `/market/overview`

**Response:**
```json
{
  "code": 200,
  "data": {
    "timestamp": "2024-10-26T15:00:00Z",
    "indices": [
      {
        "symbol": "000001.SZ",
        "name": "Shenzhen Composite",
        "lastPrice": 1234.56,
        "change": 12.34,
        "changePercent": 1.01,
        "volume": 123456789000,
        "turnover": 150000000000
      },
      {
        "symbol": "000300.SH",
        "name": "CSI 300",
        "lastPrice": 3456.78,
        "change": -5.67,
        "changePercent": -0.16,
        "volume": 98765432000,
        "turnover": 120000000000
      }
    ],
    "marketStatus": "open",
    "marketTrend": "mixed",
    "gainers": [
      { "symbol": "600000.SH", "name": "浦发银行", "change": 5.5 }
    ],
    "decliners": [
      { "symbol": "600001.SH", "name": "邯郸钢铁", "change": -3.2 }
    ]
  }
}
```

---

### 2. Get Sector Performance
**GET** `/market/sector-performance`

**Query Parameters:**
- `market`: "A", "HK", "US" (default: "A")
- `sortBy`: "change", "volume", "marketCap"

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "sector": "Banking",
      "sectorCode": "I1010",
      "performance": 1.23,
      "change": 12.34,
      "volume": 500000000000,
      "stocks": 50,
      "gainers": 35,
      "decliners": 15
    },
    {
      "sector": "Technology",
      "sectorCode": "I1020",
      "performance": -0.45,
      "change": -5.67,
      "volume": 300000000000,
      "stocks": 80,
      "gainers": 30,
      "decliners": 50
    }
  ]
}
```

---

### 3. Get Sector Rotation
**GET** `/market/sector-rotation`

**Query Parameters:**
- `period`: "1d", "1w", "1m", "3m", "6m", "1y" (default: "1m")

**Response:**
```json
{
  "code": 200,
  "data": {
    "period": "1m",
    "rotationData": [
      {
        "date": "2024-10-01",
        "leaders": ["Banking", "Real Estate"],
        "laggards": ["Technology", "Consumer"],
        "momentum": [
          { "sector": "Banking", "momentum": 2.5 },
          { "sector": "Real Estate", "momentum": 1.8 }
        ]
      }
    ],
    "currentRotation": {
      "cyclical": [
        "Banking", "Real Estate", "Basic Materials"
      ],
      "defensive": [
        "Utilities", "Consumer Staples", "Healthcare"
      ],
      "growth": [
        "Technology", "Consumer Discretionary"
      ]
    }
  }
}
```

---

### 4. Get Market Sentiment
**GET** `/market/sentiment`

**Response:**
```json
{
  "code": 200,
  "data": {
    "overall": "bullish",
    "score": 65,
    "timestamp": "2024-10-26T15:00:00Z",
    "indicators": {
      "advanceDecline": {
        "gainers": 2000,
        "decliners": 800,
        "ratio": 2.5,
        "trend": "bullish"
      },
      "volumeAnalysis": {
        "upVolume": 500000000000,
        "downVolume": 300000000000,
        "onBalanceVolume": 200000000000
      },
      "breadthIndicators": {
        "mcclellan_oscillator": 120,
        "market_breadth": 0.65,
        "trend": "strong_bullish"
      },
      "optionsFlow": {
        "putCallRatio": 0.8,
        "trend": "bullish",
        "unusual_activity": 5
      }
    },
    "rsi": 65,
    "macd": "bullish",
    "stochastic": 75
  }
}
```

---

### 5. Get Fear & Greed Index
**GET** `/market/fear-greed`

**Response:**
```json
{
  "code": 200,
  "data": {
    "index": 65,
    "classification": "greed",
    "timestamp": "2024-10-26T15:00:00Z",
    "components": {
      "marketMomentum": { "value": 70, "weight": 25 },
      "volatility": { "value": 45, "weight": 25 },
      "sentiment": { "value": 75, "weight": 25 },
      "junk_bonds": { "value": 60, "weight": 25 }
    },
    "history": [
      { "date": "2024-10-25", "index": 62 },
      { "date": "2024-10-24", "index": 60 }
    ]
  }
}
```

---

### 6. Get Market Heatmap
**GET** `/market/heatmap`

**Query Parameters:**
- `type`: "sector", "market-cap", "country"
- `market`: "A", "HK", "US"

**Response:**
```json
{
  "code": 200,
  "data": {
    "type": "sector",
    "date": "2024-10-26",
    "items": [
      {
        "name": "Banking",
        "value": 1.23,
        "size": 500000000000,
        "stocks": 50,
        "color": "green"
      },
      {
        "name": "Technology",
        "value": -0.45,
        "size": 300000000000,
        "stocks": 80,
        "color": "red"
      }
    ]
  }
}
```

---

### 7. Get Money Flow Analysis
**GET** `/market/money-flow`

**Query Parameters:**
- `symbol`: Stock symbol
- `period`: "1d", "1w", "1m" (default: "1d")

**Response:**
```json
{
  "code": 200,
  "data": {
    "symbol": "600000.SH",
    "date": "2024-10-26",
    "inflow": 500000000,
    "outflow": 300000000,
    "netFlow": 200000000,
    "netFlowPercent": 6.7,
    "largeOrderBuy": 150000000,
    "largeOrderSell": 100000000,
    "netLargeOrder": 50000000,
    "institutions": {
      "inflow": 200000000,
      "outflow": 100000000,
      "netFlow": 100000000
    },
    "retail": {
      "inflow": 300000000,
      "outflow": 200000000,
      "netFlow": 100000000
    }
  }
}
```

---

### 8. Get Market Movers
**GET** `/market/movers`

**Query Parameters:**
- `type`: "gainers", "decliners", "volume"
- `limit`: Number of results (default: 20)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "rank": 1,
      "symbol": "000001.SH",
      "name": "Stock Name",
      "price": 12.34,
      "change": 5.67,
      "changePercent": 4.6,
      "volume": 123456789,
      "turnover": 1500000000
    }
  ]
}
```

---

## News Endpoints

### 1. Get News List
**GET** `/news/list`

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20)
- `category`: "market", "stock", "industry", "announcement", "economic"
- `importance`: 1-10 importance level
- `days`: From last N days (default: 30)

**Response:**
```json
{
  "code": 200,
  "data": {
    "total": 500,
    "page": 1,
    "pageSize": 20,
    "items": [
      {
        "id": "news-uuid",
        "title": "News Title",
        "summary": "Brief summary",
        "content": "Full content",
        "source": "Source Name",
        "url": "https://example.com",
        "imageUrl": "https://example.com/image.jpg",
        "category": "market",
        "importance": 8,
        "sentiment": "positive",
        "sentimentScore": 0.75,
        "publishedAt": "2024-10-26T09:30:00Z",
        "stocks": ["600000.SH", "600001.SH"],
        "tags": ["banking", "earnings"]
      }
    ]
  }
}
```

---

### 2. Get News by Stock
**GET** `/news/stock/{symbol}`

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page (default: 20)
- `days`: From last N days (default: 30)

**Response:** Same as Get News List

---

### 3. Get News Analysis
**GET** `/news/analysis`

**Query Parameters:**
- `period`: "1d", "1w", "1m" (default: "1w")
- `topN`: Top N news (default: 10)

**Response:**
```json
{
  "code": 200,
  "data": {
    "period": "1w",
    "sentimentTrend": [
      { "date": "2024-10-20", "score": 0.55 },
      { "date": "2024-10-21", "score": 0.60 }
    ],
    "topStories": [
      {
        "id": "news-uuid",
        "title": "Breaking News",
        "sentiment": "positive",
        "sentimentScore": 0.85,
        "mentions": 150,
        "stocks": ["600000.SH"]
      }
    ],
    "wordCloud": [
      { "word": "earnings", "frequency": 50 },
      { "word": "growth", "frequency": 45 }
    ],
    "stocksSentiment": [
      {
        "symbol": "600000.SH",
        "name": "浦发银行",
        "newsCount": 15,
        "sentiment": "positive",
        "sentimentScore": 0.72
      }
    ]
  }
}
```

---

### 4. Get Earnings Calendar
**GET** `/calendar/earnings`

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `market`: "A", "HK", "US"

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "event-uuid",
      "symbol": "600000.SH",
      "name": "浦发银行",
      "date": "2024-10-30T00:00:00Z",
      "eventType": "earnings",
      "estimatedEPS": 0.42,
      "lastYearEPS": 0.38,
      "epsEstimates": {
        "high": 0.45,
        "low": 0.40,
        "average": 0.42
      },
      "estimatedRevenue": 50000000000,
      "lastYearRevenue": 48000000000,
      "importance": 9,
      "status": "scheduled"
    }
  ]
}
```

---

### 5. Get Dividend Calendar
**GET** `/calendar/dividends`

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date
- `exDividendDate`: Filter by ex-dividend date

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "event-uuid",
      "symbol": "600000.SH",
      "name": "浦发银行",
      "announcementDate": "2024-08-15",
      "exDividendDate": "2024-09-01",
      "recordDate": "2024-09-02",
      "paymentDate": "2024-09-15",
      "dividendPerShare": 0.35,
      "totalDividend": 4200000000,
      "yield": 2.84,
      "type": "cash"
    }
  ]
}
```

---

### 6. Get Economic Calendar
**GET** `/calendar/economic`

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date
- `country`: "CN", "US" (default: "CN")
- `importance`: 1-3 (1: Low, 3: High)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "event-uuid",
      "name": "CPI",
      "country": "CN",
      "releaseDate": "2024-10-28T10:00:00Z",
      "previousValue": 2.5,
      "forecastValue": 2.8,
      "actualValue": null,
      "importance": 3,
      "impact": "high",
      "status": "scheduled"
    }
  ]
}
```

---

## China Features Endpoints

### 1. Get North Money Flow (沪深港通)
**GET** `/china-features/north-money-flow`

**Query Parameters:**
- `symbol`: Optional stock symbol
- `period`: "1d", "1w", "1m" (default: "1d")

**Response:**
```json
{
  "code": 200,
  "data": {
    "date": "2024-10-26",
    "shConnectInflow": 500000000,
    "shConnectOutflow": 300000000,
    "shConnectNetFlow": 200000000,
    "szConnectInflow": 400000000,
    "szConnectOutflow": 200000000,
    "szConnectNetFlow": 200000000,
    "totalInflow": 900000000,
    "totalOutflow": 500000000,
    "totalNetFlow": 400000000,
    "shBalanceRemaining": 5000000000,
    "szBalanceRemaining": 5000000000,
    "topBuyers": [
      { "rank": 1, "symbol": "600000.SH", "name": "浦发银行", "netFlow": 50000000 }
    ],
    "topSellers": [
      { "rank": 1, "symbol": "600001.SH", "name": "邯郸钢铁", "netFlow": -30000000 }
    ]
  }
}
```

---

### 2. Get Long Hu Bang (龙虎榜)
**GET** `/china-features/long-hu-bang`

**Query Parameters:**
- `date`: Specific date (YYYY-MM-DD)
- `market`: "SZ", "SH" (default: both)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "entry-uuid",
      "symbol": "000001.SZ",
      "name": "Stock Name",
      "date": "2024-10-26",
      "close": 12.34,
      "changePercent": 5.5,
      "volume": 123456789,
      "turnover": 1500000000,
      "reason": "连续3个涨停板",
      "buyersTop5": [
        {
          "rank": 1,
          "branchName": "China Securities Branch",
          "amount": 50000000
        }
      ],
      "sellersTop5": [
        {
          "rank": 1,
          "branchName": "Another Securities Branch",
          "amount": 30000000
        }
      ]
    }
  ]
}
```

---

### 3. Get Margin Trading Data
**GET** `/china-features/margin-trading`

**Query Parameters:**
- `symbol`: Optional stock symbol
- `period`: "1d", "1w", "1m" (default: "1d")

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "600000.SH",
      "name": "浦发银行",
      "date": "2024-10-26",
      "marginBalance": 10000000000,
      "shortBalance": 2000000000,
      "marginBuyAmount": 500000000,
      "marginSellAmount": 300000000,
      "marginRatio": 2.5,
      "short_volume": 50000000,
      "short_value": 617500000,
      "netFlow": 200000000,
      "balanceChange": 50000000
    }
  ]
}
```

---

### 4. Get Concept Sectors (概念板块)
**GET** `/china-features/concepts`

**Query Parameters:**
- `sortBy`: "change", "volume", "gainers"
- `limit`: Number of results (default: 50)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "conceptId": "concept-uuid",
      "name": "AI Concept",
      "stocks": 50,
      "gainers": 35,
      "decliners": 15,
      "performance": 2.5,
      "volume": 300000000000,
      "topStocks": [
        { "symbol": "000001.SZ", "name": "Stock", "change": 5.5 }
      ]
    }
  ]
}
```

---

## Error Codes

- `400`: Invalid parameters
- `404`: Data not found
- `503`: Data source unavailable
