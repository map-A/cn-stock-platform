# Stock Service API

## Overview
Provides stock-related data including quotes, history, financial metrics, news, and technical analysis.

## API Endpoints

### 1. Get Stock Quote
**GET** `/stock/quote/{symbol}`

**Parameters:**
- `symbol`: Stock code (e.g., "600000.SH", "AAPL")

**Response:**
```json
{
  "code": 200,
  "data": {
    "symbol": "600000.SH",
    "name": "浦发银行",
    "exchange": "SHA",
    "lastPrice": 12.34,
    "previousClose": 12.30,
    "open": 12.32,
    "high": 12.45,
    "low": 12.20,
    "volume": 123456789,
    "volumeRatio": 1.2,
    "turnover": 1524000000,
    "turnoverRate": 2.34,
    "priceChange": 0.04,
    "priceChangePercent": 0.33,
    "marketCap": 150000000000,
    "pe": 8.5,
    "pb": 1.2,
    "dividend": 0.35,
    "yieldRate": 2.84,
    "timestamp": "2024-10-26T09:30:00Z",
    "status": "TRADING"
  }
}
```

---

### 2. Get Multiple Stock Quotes
**POST** `/stock/quotes`

**Request Body:**
```json
{
  "symbols": ["600000.SH", "600001.SH", "AAPL"]
}
```

**Response:**
```json
{
  "code": 200,
  "data": [
    { /* Stock Quote Object */ },
    { /* Stock Quote Object */ }
  ]
}
```

---

### 3. Get Stock Basic Info
**GET** `/stock/info/{symbol}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "symbol": "600000.SH",
    "name": "浦发银行",
    "nameEn": "Shanghai Pudong Development Bank",
    "exchange": "SHA",
    "sector": "金融",
    "industry": "银行",
    "market": "A股",
    "listDate": "2000-11-10",
    "totalShares": 12000000000,
    "circulatingShares": 11500000000,
    "marketCap": 150000000000,
    "website": "www.spdb.com.cn",
    "description": "商业银行",
    "chairman": "Chairman Name",
    "generalManager": "GM Name"
  }
}
```

---

### 4. Get Stock Chart Data
**GET** `/stock/chart/{symbol}`

**Query Parameters:**
- `period`: "1D", "5D", "1M", "3M", "6M", "1Y", "YTD", "MAX" (default: "1M")
- `interval`: "1m", "5m", "15m", "30m", "1h", "1d", "1w", "1M" (default: auto)

**Response:**
```json
{
  "code": 200,
  "data": {
    "symbol": "600000.SH",
    "period": "1M",
    "interval": "1d",
    "candles": [
      {
        "timestamp": "2024-10-01T09:30:00Z",
        "open": 12.10,
        "high": 12.45,
        "low": 12.05,
        "close": 12.30,
        "volume": 123456789,
        "turnover": 1500000000
      }
    ],
    "startTime": "2024-09-26T00:00:00Z",
    "endTime": "2024-10-26T00:00:00Z"
  }
}
```

---

### 5. Get Intraday Time Share Data
**GET** `/stock/timeshare/{symbol}`

**Parameters:**
- `date`: Optional specific date (YYYY-MM-DD)

**Response:**
```json
{
  "code": 200,
  "data": {
    "symbol": "600000.SH",
    "date": "2024-10-26",
    "data": [
      {
        "timestamp": "2024-10-26T09:30:00Z",
        "price": 12.32,
        "volume": 5000000,
        "turnover": 61600000,
        "avgPrice": 12.32
      }
    ]
  }
}
```

---

### 6. Search Stocks
**GET** `/stock/search`

**Query Parameters:**
- `q`: Search keyword (code or name)
- `limit`: Results limit (default: 10, max: 50)
- `market`: Filter by market ("A", "HK", "US")

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "600000.SH",
      "name": "浦发银行",
      "exchange": "SHA",
      "lastPrice": 12.34,
      "priceChangePercent": 0.33
    }
  ]
}
```

---

### 7. Get Hot Stocks
**GET** `/stock/hot`

**Query Parameters:**
- `limit`: Number of results (default: 10, max: 50)
- `period`: "1d", "1w", "1m" (default: "1d")
- `market`: Filter by market

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "600000.SH",
      "name": "浦发银行",
      "volume": 1234567890,
      "turnover": 15000000000,
      "rank": 1
    }
  ]
}
```

---

### 8. Get Financial Metrics
**GET** `/stock/financial/{symbol}`

**Query Parameters:**
- `periods`: Number of periods (default: 4, max: 20)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "reportDate": "2024-09-30",
      "reportType": "Q3",
      "revenue": 50000000000,
      "netProfit": 5000000000,
      "eps": 0.42,
      "roe": 12.5,
      "roa": 1.2,
      "currentRatio": 1.5,
      "quickRatio": 1.2,
      "debtToEquity": 0.5,
      "operatingMargin": 10.5,
      "grossMargin": 25.3
    }
  ]
}
```

---

### 9. Get Shareholders
**GET** `/stock/shareholders/{symbol}`

**Query Parameters:**
- `type`: 1 (Individual), 2 (Institutional), 3 (All - default)
- `limit`: Top N shareholders (default: 10)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "rank": 1,
      "name": "Shareholder Name",
      "type": "Institutional",
      "shares": 1200000000,
      "percentage": 10.0,
      "changePercent": 0.5,
      "changeShares": 5000000,
      "status": "增持" 
    }
  ]
}
```

---

### 10. Get Stock News
**GET** `/stock/news/{symbol}`

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20)
- `days`: News from last N days (default: 30)

**Response:**
```json
{
  "code": 200,
  "data": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "items": [
      {
        "id": "news-id-123",
        "title": "News Title",
        "summary": "Brief summary of the news",
        "source": "Source Name",
        "url": "https://example.com/news",
        "publishedAt": "2024-10-26T09:30:00Z",
        "sentiment": "positive",
        "sentiment_score": 0.75,
        "category": "announcement",
        "importance": 8
      }
    ]
  }
}
```

---

### 11. Get Stock Announcements
**GET** `/stock/announcements/{symbol}`

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page
- `category`: "announcement", "disclosure", "corporate-action"

**Response:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "items": [
      {
        "id": "announcement-id",
        "title": "Annual Report Announcement",
        "date": "2024-10-26",
        "category": "disclosure",
        "url": "https://example.com/announcement",
        "importance": 9
      }
    ]
  }
}
```

---

### 12. Get Insider Trading
**GET** `/stock/insider-trading/{symbol}`

**Query Parameters:**
- `limit`: Number of records (default: 20)
- `days`: From last N days (default: 90)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "date": "2024-10-20",
      "trader": "Executive Name",
      "position": "CEO",
      "transactionType": "buy",
      "quantity": 100000,
      "price": 12.34,
      "amount": 1234000,
      "purpose": "Investment"
    }
  ]
}
```

---

### 13. Get Stock Dividends History
**GET** `/stock/dividends/{symbol}`

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "div-id-123",
      "announcementDate": "2024-08-15",
      "exDividendDate": "2024-09-01",
      "paymentDate": "2024-09-15",
      "dividendPerShare": 0.35,
      "totalDividend": 4200000000,
      "type": "cash",
      "yield": 2.84
    }
  ]
}
```

---

### 14. Get Stock Splits History
**GET** `/stock/splits/{symbol}`

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "date": "2020-05-10",
      "splitRatio": "10:1",
      "description": "10-for-1 stock split"
    }
  ]
}
```

---

### 15. Compare Multiple Stocks
**POST** `/stock/compare`

**Request Body:**
```json
{
  "symbols": ["600000.SH", "600001.SH"],
  "metrics": ["pe", "pb", "roe", "eps", "dividend"]
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "600000.SH": {
      "name": "浦发银行",
      "pe": 8.5,
      "pb": 1.2,
      "roe": 12.5,
      "eps": 0.42,
      "dividend": 0.35
    },
    "600001.SH": {
      "name": "邯郸钢铁",
      "pe": 5.2,
      "pb": 0.9,
      "roe": 10.2,
      "eps": 0.28,
      "dividend": 0.20
    }
  }
}
```

---

## Data Models

### StockQuote
Main real-time quote information for a stock.

### StockInfo
Basic company information and listing details.

### FinancialMetrics
Company financial statements and ratios.

### ShareholderInfo
Major shareholders and ownership structure.

### StockNews
News articles and announcements.

---

## Error Codes

- `404`: Symbol not found
- `400`: Invalid parameters
- `503`: Data source unavailable
