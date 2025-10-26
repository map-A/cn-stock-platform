# Portfolio & Watchlist Service API

## Overview
Manages user portfolios, watchlists, holdings, and personal investment tracking.

## Watchlist Endpoints

### 1. Get User Watchlists
**GET** `/watchlist/lists`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "watchlist-uuid",
      "name": "Banking Sector",
      "description": "Banks and financial institutions",
      "createdAt": "2024-10-01T00:00:00Z",
      "updatedAt": "2024-10-26T00:00:00Z",
      "stockCount": 15,
      "isDefault": true,
      "isPublic": false
    }
  ]
}
```

---

### 2. Create Watchlist
**POST** `/watchlist/lists`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Tech Stocks",
  "description": "Technology sector stocks",
  "isPublic": false
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "watchlist-uuid",
    "name": "Tech Stocks",
    "description": "Technology sector stocks",
    "createdAt": "2024-10-26T00:00:00Z",
    "isPublic": false
  }
}
```

---

### 3. Update Watchlist
**PUT** `/watchlist/lists/{watchlistId}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Tech Stocks Updated",
  "description": "Updated description",
  "isPublic": true
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Watchlist updated successfully"
}
```

---

### 4. Delete Watchlist
**DELETE** `/watchlist/lists/{watchlistId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "message": "Watchlist deleted successfully"
}
```

---

### 5. Get Watchlist Stocks
**GET** `/watchlist/lists/{watchlistId}/stocks`

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page (default: 50)
- `sortBy`: "symbol", "lastPrice", "priceChange", "addedDate"
- `sortOrder`: "asc", "desc"

**Response:**
```json
{
  "code": 200,
  "data": {
    "total": 15,
    "page": 1,
    "pageSize": 50,
    "items": [
      {
        "id": "stock-item-uuid",
        "symbol": "600000.SH",
        "name": "浦发银行",
        "addedPrice": 12.30,
        "lastPrice": 12.34,
        "priceChange": 0.04,
        "priceChangePercent": 0.33,
        "addedAt": "2024-10-01T00:00:00Z",
        "notes": "Strong fundamentals"
      }
    ]
  }
}
```

---

### 6. Add Stock to Watchlist
**POST** `/watchlist/lists/{watchlistId}/stocks`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "symbol": "600000.SH",
  "notes": "Optional notes about this stock"
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "stock-item-uuid",
    "symbol": "600000.SH",
    "addedAt": "2024-10-26T00:00:00Z"
  }
}
```

---

### 7. Remove Stock from Watchlist
**DELETE** `/watchlist/lists/{watchlistId}/stocks/{symbol}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "message": "Stock removed from watchlist"
}
```

---

### 8. Update Stock in Watchlist
**PUT** `/watchlist/lists/{watchlistId}/stocks/{symbol}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Stock updated in watchlist"
}
```

---

## Portfolio Endpoints

### 1. Get User Portfolios
**GET** `/portfolio/list`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `includeDetails`: Include holdings details (default: false)

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "portfolio-uuid",
      "name": "Main Portfolio",
      "description": "Personal investment portfolio",
      "createdAt": "2024-01-01T00:00:00Z",
      "currency": "CNY",
      "totalValue": 1000000,
      "totalInvested": 950000,
      "totalReturn": 50000,
      "returnPercent": 5.26,
      "holdingsCount": 10,
      "isDefault": true
    }
  ]
}
```

---

### 2. Get Portfolio Details
**GET** `/portfolio/{portfolioId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "portfolio-uuid",
    "name": "Main Portfolio",
    "description": "Personal investment portfolio",
    "currency": "CNY",
    "totalValue": 1000000,
    "totalInvested": 950000,
    "totalReturn": 50000,
    "returnPercent": 5.26,
    "cash": 50000,
    "holdings": [
      {
        "id": "holding-uuid",
        "symbol": "600000.SH",
        "name": "浦发银行",
        "quantity": 1000,
        "averageCost": 12.00,
        "currentPrice": 12.34,
        "totalCost": 12000,
        "currentValue": 12340,
        "gainLoss": 340,
        "gainLossPercent": 2.83,
        "purchaseDate": "2024-10-01T00:00:00Z",
        "weight": 1.23
      }
    ],
    "performanceMetrics": {
      "annualizedReturn": 8.5,
      "sharpeRatio": 1.2,
      "maxDrawdown": -15.3,
      "volatility": 12.5
    },
    "allocation": {
      "byAssetClass": {
        "stocks": 85.0,
        "cash": 15.0
      },
      "bySector": {
        "banking": 25.0,
        "technology": 20.0
      }
    }
  }
}
```

---

### 3. Create Portfolio
**POST** `/portfolio/create`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "New Portfolio",
  "description": "Description of portfolio",
  "currency": "CNY"
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "portfolio-uuid",
    "name": "New Portfolio",
    "createdAt": "2024-10-26T00:00:00Z"
  }
}
```

---

### 4. Update Portfolio
**PUT** `/portfolio/{portfolioId}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Updated Portfolio Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Portfolio updated successfully"
}
```

---

### 5. Delete Portfolio
**DELETE** `/portfolio/{portfolioId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "message": "Portfolio deleted successfully"
}
```

---

## Holdings Endpoints

### 1. Add Holding
**POST** `/portfolio/{portfolioId}/holdings`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "symbol": "600000.SH",
  "quantity": 1000,
  "purchasePrice": 12.00,
  "purchaseDate": "2024-10-01T00:00:00Z",
  "commission": 60,
  "notes": "Initial purchase"
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "holding-uuid",
    "symbol": "600000.SH",
    "quantity": 1000,
    "averageCost": 12.00,
    "currentValue": 12340,
    "gainLoss": 340,
    "gainLossPercent": 2.83
  }
}
```

---

### 2. Update Holding
**PUT** `/portfolio/{portfolioId}/holdings/{holdingId}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "quantity": 1500,
  "notes": "Added more shares"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Holding updated successfully"
}
```

---

### 3. Remove Holding
**DELETE** `/portfolio/{portfolioId}/holdings/{holdingId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "message": "Holding removed successfully"
}
```

---

### 4. Get Holding History
**GET** `/portfolio/{portfolioId}/holdings/{holdingId}/history`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "transaction-uuid",
      "date": "2024-10-01T00:00:00Z",
      "type": "buy",
      "quantity": 1000,
      "price": 12.00,
      "amount": 12000,
      "commission": 60,
      "notes": "Initial purchase"
    }
  ]
}
```

---

## Portfolio Performance Endpoints

### 1. Get Portfolio Performance
**GET** `/portfolio/{portfolioId}/performance`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `period`: "1d", "1w", "1m", "3m", "6m", "1y", "all" (default: "all")

**Response:**
```json
{
  "code": 200,
  "data": {
    "period": "1y",
    "startDate": "2023-10-26T00:00:00Z",
    "endDate": "2024-10-26T00:00:00Z",
    "startValue": 950000,
    "endValue": 1000000,
    "totalReturn": 50000,
    "totalReturnPercent": 5.26,
    "annualizedReturn": 5.26,
    "volatility": 12.5,
    "sharpeRatio": 1.2,
    "maxDrawdown": -15.3,
    "calmarRatio": 0.34,
    "sortinoRatio": 1.5,
    "winRate": 0.65,
    "profitFactor": 2.1,
    "benchmarkComparison": {
      "benchmarkSymbol": "000001.SZ",
      "benchmarkReturn": 8.5,
      "outperformance": -3.24,
      "beta": 0.95,
      "alpha": 0.2
    }
  }
}
```

---

### 2. Get Portfolio Allocation
**GET** `/portfolio/{portfolioId}/allocation`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "byAssetClass": [
      {
        "assetClass": "stocks",
        "value": 850000,
        "percentage": 85.0
      },
      {
        "assetClass": "cash",
        "value": 150000,
        "percentage": 15.0
      }
    ],
    "bySector": [
      {
        "sector": "banking",
        "value": 250000,
        "percentage": 25.0,
        "stocksCount": 3
      },
      {
        "sector": "technology",
        "value": 200000,
        "percentage": 20.0,
        "stocksCount": 2
      }
    ],
    "byMarket": [
      {
        "market": "A",
        "value": 800000,
        "percentage": 80.0
      },
      {
        "market": "HK",
        "value": 200000,
        "percentage": 20.0
      }
    ]
  }
}
```

---

### 3. Get Risk Metrics
**GET** `/portfolio/{portfolioId}/risk-metrics`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "volatility": 12.5,
    "value_at_risk_95": 25000,
    "value_at_risk_99": 35000,
    "conditional_var_95": 28000,
    "max_drawdown": -15.3,
    "average_drawdown": -8.2,
    "recovery_factor": 1.8,
    "concentration_ratio": 0.35,
    "beta": 0.95,
    "correlation": 0.75,
    "downside_deviation": 8.5
  }
}
```

---

## Holdings Transaction Endpoints

### 1. Record Trade Transaction
**POST** `/portfolio/{portfolioId}/transactions`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "type": "buy",
  "symbol": "600000.SH",
  "quantity": 100,
  "price": 12.34,
  "date": "2024-10-26T09:30:00Z",
  "commission": 37,
  "notes": "Market order"
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "transaction-uuid",
    "type": "buy",
    "symbol": "600000.SH",
    "quantity": 100,
    "price": 12.34,
    "amount": 1234,
    "commission": 37,
    "totalAmount": 1271,
    "date": "2024-10-26T09:30:00Z"
  }
}
```

---

### 2. Get Transaction History
**GET** `/portfolio/{portfolioId}/transactions`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page (default: 20)
- `type`: "buy", "sell"
- `symbol`: Filter by stock symbol
- `startDate`: From date
- `endDate`: To date

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
        "id": "transaction-uuid",
        "type": "buy",
        "symbol": "600000.SH",
        "quantity": 100,
        "price": 12.34,
        "amount": 1234,
        "commission": 37,
        "totalAmount": 1271,
        "date": "2024-10-26T09:30:00Z"
      }
    ]
  }
}
```

---

## Error Codes

- `400`: Invalid request
- `404`: Portfolio or stock not found
- `409`: Insufficient holdings for sell order
- `422`: Validation failed
