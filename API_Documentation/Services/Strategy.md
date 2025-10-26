# Strategy & Backtesting Service API

## Overview
Manages investment strategies, strategy backtesting, parameter optimization, and performance tracking.

## Strategy Endpoints

### 1. Get User Strategies
**GET** `/strategy/list`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page (default: 20)
- `status`: "active", "inactive", "archived"

**Response:**
```json
{
  "code": 200,
  "data": {
    "total": 15,
    "page": 1,
    "pageSize": 20,
    "items": [
      {
        "id": "strategy-uuid",
        "name": "Moving Average Crossover",
        "description": "SMA 50/200 crossover strategy",
        "type": "technical",
        "status": "active",
        "createdAt": "2024-09-01T00:00:00Z",
        "updatedAt": "2024-10-26T00:00:00Z",
        "isPublic": false,
        "author": "User Name",
        "subscribers": 5,
        "version": 2,
        "tags": ["technical", "trend-following"]
      }
    ]
  }
}
```

---

### 2. Get Strategy Details
**GET** `/strategy/get/{strategyId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "strategy-uuid",
    "name": "Moving Average Crossover",
    "description": "SMA 50/200 crossover strategy",
    "type": "technical",
    "status": "active",
    "parameters": [
      {
        "name": "shortPeriod",
        "type": "integer",
        "value": 50,
        "description": "Short-term moving average period",
        "min": 10,
        "max": 100
      },
      {
        "name": "longPeriod",
        "type": "integer",
        "value": 200,
        "description": "Long-term moving average period",
        "min": 100,
        "max": 500
      }
    ],
    "riskManagement": {
      "stopLoss": 2.0,
      "takeProfit": 5.0,
      "positionSize": 100,
      "maxDrawdown": 20.0
    },
    "rules": [
      {
        "id": "rule-1",
        "trigger": "sma50 > sma200",
        "action": "buy",
        "quantity": "100%"
      },
      {
        "id": "rule-2",
        "trigger": "sma50 < sma200",
        "action": "sell",
        "quantity": "100%"
      }
    ],
    "backtestResults": {
      "totalReturn": 45.5,
      "sharpeRatio": 1.23,
      "maxDrawdown": -15.2,
      "winRate": 0.65,
      "totalTrades": 125
    },
    "createdBy": "user-uuid",
    "createdAt": "2024-09-01T00:00:00Z",
    "updatedAt": "2024-10-26T00:00:00Z",
    "isPublic": false
  }
}
```

---

### 3. Create Strategy
**POST** `/strategy/create`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "New Strategy",
  "description": "Strategy description",
  "type": "technical",
  "parameters": [
    {
      "name": "period",
      "type": "integer",
      "value": 50,
      "min": 10,
      "max": 100
    }
  ],
  "riskManagement": {
    "stopLoss": 2.0,
    "takeProfit": 5.0,
    "positionSize": 100,
    "maxDrawdown": 20.0
  },
  "rules": [
    {
      "trigger": "condition",
      "action": "buy",
      "quantity": "100%"
    }
  ],
  "isPublic": false
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "strategy-uuid",
    "name": "New Strategy",
    "status": "draft",
    "createdAt": "2024-10-26T00:00:00Z"
  }
}
```

---

### 4. Update Strategy
**PUT** `/strategy/update/{strategyId}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Updated Strategy Name",
  "description": "Updated description",
  "parameters": [],
  "riskManagement": {},
  "rules": []
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Strategy updated successfully"
}
```

---

### 5. Delete Strategy
**DELETE** `/strategy/delete/{strategyId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "message": "Strategy deleted successfully"
}
```

---

### 6. Clone Strategy
**POST** `/strategy/{strategyId}/clone`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Cloned Strategy Name"
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "new-strategy-uuid",
    "name": "Cloned Strategy Name",
    "createdAt": "2024-10-26T00:00:00Z"
  }
}
```

---

### 7. Publish Strategy
**POST** `/strategy/{strategyId}/publish`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "tags": ["technical", "trend-following"],
  "description": "Public description"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Strategy published successfully",
  "data": {
    "isPublic": true,
    "publishedAt": "2024-10-26T00:00:00Z"
  }
}
```

---

## Backtesting Endpoints

### 1. Create Backtest
**POST** `/backtest/create`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "strategyId": "strategy-uuid",
  "symbols": ["600000.SH", "600001.SH"],
  "startDate": "2023-01-01",
  "endDate": "2024-10-26",
  "initialCapital": 100000,
  "slippage": 0.001,
  "commission": 0.0005,
  "parameters": {
    "shortPeriod": 50,
    "longPeriod": 200
  }
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "backtest-uuid",
    "strategyId": "strategy-uuid",
    "status": "running",
    "progress": 0,
    "createdAt": "2024-10-26T00:00:00Z"
  }
}
```

---

### 2. Get Backtest Status
**GET** `/backtest/get/{backtestId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "backtest-uuid",
    "strategyId": "strategy-uuid",
    "status": "completed",
    "progress": 100,
    "createdAt": "2024-10-26T00:00:00Z",
    "completedAt": "2024-10-26T10:30:00Z",
    "summary": {
      "totalReturn": 45.5,
      "annualizedReturn": 15.2,
      "sharpeRatio": 1.23,
      "maxDrawdown": -15.2,
      "calmarRatio": 1.0,
      "sortinoRatio": 1.45,
      "winRate": 0.65,
      "profitFactor": 2.1,
      "totalTrades": 125,
      "winningTrades": 81,
      "losingTrades": 44,
      "averageWin": 800,
      "averageLoss": -400,
      "largestWin": 5000,
      "largestLoss": -2000,
      "consecutive_wins": 8,
      "consecutive_losses": 5,
      "recovery_factor": 2.1,
      "payoff_ratio": 2.0,
      "exposureTime": 0.95
    }
  }
}
```

---

### 3. Get Backtest Results
**GET** `/backtest/result/{backtestId}`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `includeEquityCurve`: Include equity curve data (default: true)
- `includeTrades`: Include individual trades (default: true)

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "backtest-uuid",
    "summary": { /* Performance metrics */ },
    "equityCurve": [
      {
        "date": "2023-01-01T00:00:00Z",
        "equity": 100000,
        "cash": 100000,
        "positions": 0
      }
    ],
    "trades": [
      {
        "id": "trade-uuid",
        "date": "2023-01-15T09:30:00Z",
        "symbol": "600000.SH",
        "type": "buy",
        "quantity": 1000,
        "price": 10.5,
        "amount": 10500,
        "commission": 5.25,
        "signal": "sma50_cross_sma200"
      },
      {
        "id": "trade-uuid-2",
        "date": "2023-02-01T14:30:00Z",
        "symbol": "600000.SH",
        "type": "sell",
        "quantity": 1000,
        "price": 11.2,
        "amount": 11200,
        "commission": 5.6,
        "signal": "sma50_below_sma200",
        "profit": 700,
        "profitPercent": 6.67
      }
    ],
    "monthlyReturns": [
      {
        "month": "2023-01",
        "return": 2.5
      }
    ],
    "drawdownPeriods": [
      {
        "startDate": "2023-02-01T00:00:00Z",
        "endDate": "2023-02-15T00:00:00Z",
        "depth": -5.2,
        "recovery": 10
      }
    ]
  }
}
```

---

### 4. Get User Backtests
**GET** `/backtest/list`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page (default: 20)
- `strategyId`: Filter by strategy
- `status`: "completed", "running", "failed"

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
        "id": "backtest-uuid",
        "strategyId": "strategy-uuid",
        "strategyName": "Moving Average Crossover",
        "status": "completed",
        "symbols": ["600000.SH"],
        "startDate": "2023-01-01",
        "endDate": "2024-10-26",
        "totalReturn": 45.5,
        "sharpeRatio": 1.23,
        "maxDrawdown": -15.2,
        "winRate": 0.65,
        "totalTrades": 125,
        "createdAt": "2024-10-26T00:00:00Z"
      }
    ]
  }
}
```

---

### 5. Delete Backtest
**DELETE** `/backtest/{backtestId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "message": "Backtest deleted successfully"
}
```

---

## Parameter Optimization Endpoints

### 1. Start Parameter Optimization
**POST** `/strategy/{strategyId}/optimize`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "symbols": ["600000.SH", "600001.SH"],
  "startDate": "2023-01-01",
  "endDate": "2024-10-26",
  "initialCapital": 100000,
  "parameters": [
    {
      "name": "shortPeriod",
      "type": "integer",
      "min": 20,
      "max": 80,
      "step": 5
    },
    {
      "name": "longPeriod",
      "type": "integer",
      "min": 150,
      "max": 250,
      "step": 10
    }
  ],
  "optimizationMethod": "grid",
  "objectiveMetric": "sharpeRatio"
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "optimization-uuid",
    "strategyId": "strategy-uuid",
    "status": "running",
    "progress": 0,
    "totalCombinations": 143,
    "createdAt": "2024-10-26T00:00:00Z"
  }
}
```

---

### 2. Get Optimization Results
**GET** `/strategy/{strategyId}/optimize/{optimizationId}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "optimization-uuid",
    "status": "completed",
    "progress": 100,
    "totalCombinations": 143,
    "completedAt": "2024-10-26T15:30:00Z",
    "bestParameters": {
      "shortPeriod": 50,
      "longPeriod": 200
    },
    "bestMetrics": {
      "sharpeRatio": 1.45,
      "totalReturn": 52.3,
      "maxDrawdown": -12.5
    },
    "topResults": [
      {
        "rank": 1,
        "parameters": { "shortPeriod": 50, "longPeriod": 200 },
        "metrics": { "sharpeRatio": 1.45, "totalReturn": 52.3 }
      },
      {
        "rank": 2,
        "parameters": { "shortPeriod": 55, "longPeriod": 210 },
        "metrics": { "sharpeRatio": 1.42, "totalReturn": 51.8 }
      }
    ]
  }
}
```

---

## Strategy Performance Endpoints

### 1. Get Live Performance
**GET** `/strategy/{strategyId}/performance`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `period`: "1d", "1w", "1m", "3m", "6m", "1y", "all" (default: "1m")

**Response:**
```json
{
  "code": 200,
  "data": {
    "period": "1m",
    "totalReturn": 12.5,
    "annualizedReturn": 150.0,
    "sharpeRatio": 1.23,
    "maxDrawdown": -8.5,
    "winRate": 0.68,
    "totalTrades": 25,
    "avgTradeProfit": 250,
    "profitFactor": 2.5,
    "recoveryFactor": 1.8
  }
}
```

---

## Error Codes

- `400`: Invalid parameters
- `404`: Strategy or backtest not found
- `422`: Validation failed
- `503`: Backtesting service unavailable
