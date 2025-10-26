# Analysis & Tools Pages

## 1. Screener Page

**Path:** `/screener`

**Access Level:** User / Premium (Advanced filters for Premium)

### Overview
Multi-factor stock screener with customizable filters and conditions.

### Required APIs
- `POST /stock/screener` - Apply screening filters
- `GET /stock/list?filters=...` - Filtered stock list
- `GET /stock/quote/{symbol}` - Real-time quotes for results

### Key Features

**Screening Filters:**
- Price range (min/max)
- Market cap range
- P/E ratio range
- P/B ratio range
- Dividend yield
- Volume criteria
- Technical indicators (MA, MACD, RSI, etc.)
- Fundamental criteria (ROE, ROA, debt ratio)
- Industry/Sector selection
- Market selection (A-share, HK, US)

**Results Display:**
- Sortable table with key metrics
- Customizable columns
- Export to CSV
- Quick chart view
- Save screening criteria

**Premium Features:**
- Advanced technical indicators
- Multi-factor combined screening
- Save unlimited screening criteria
- Scheduled screening results
- Custom indicators

---

## 2. Risk Analysis Page

**Path:** `/risk-management`

**Access Level:** User / Premium

### Overview
Comprehensive risk assessment and management tools.

### Required APIs
- `GET /portfolio/{portfolioId}` - Portfolio data
- `GET /portfolio/{portfolioId}/risk-metrics` - Risk metrics
- `POST /risk/var` - Value at Risk calculation
- `POST /risk/stress-test` - Stress test analysis
- `GET /risk/correlation-matrix` - Asset correlation

### Key Features

**Risk Metrics Display:**
- Value at Risk (VaR) - 95% and 99% confidence
- Conditional Value at Risk (CVaR)
- Maximum Drawdown
- Volatility
- Sharpe Ratio
- Sortino Ratio
- Beta
- Correlation matrix

**Analysis Tools:**
- Stress testing (interest rates, market crash scenarios)
- Correlation analysis heatmap
- Portfolio composition by risk
- Risk contribution by asset
- Historical drawdown analysis

**Risk Alerts:**
- Risk threshold configuration
- Breach notifications
- Risk level indicators
- Compliance monitoring

---

## 3. Market Analysis Pages

### 3.1 Sector Rotation Page
**Path:** `/market/sector-rotation`

**Required APIs:**
- `GET /market/sector-rotation?period=...` - Sector rotation data
- `GET /market/sector-performance` - Performance by sector

**Features:**
- 4-quadrant rotation chart (momentum vs trend)
- Sector bubbles (size = market cap)
- Historical rotation animation
- Top/bottom performers
- Rotation narrative analysis

### 3.2 Market Heatmap Page
**Path:** `/market/heatmap`

**Required APIs:**
- `GET /market/heatmap?type=sector&market=A` - Heatmap data

**Features:**
- Treemap visualization by sector/market cap/country
- Color-coded performance
- Interactive drill-down
- Customizable grouping
- Export as image

### 3.3 Money Flow Analysis Page
**Path:** `/market/flow`

**Required APIs:**
- `GET /market/money-flow?symbol=...` - Money flow data
- `GET /market/money-flow?period=...` - Market-wide flow

**Features:**
- Inflow/outflow indicators
- Large order tracking
- Institutional vs retail flow
- Time-based flow analysis
- Sector money flow comparison

### 3.4 Fear & Greed Index Page
**Path:** `/market/fear-greed`

**Required APIs:**
- `GET /market/fear-greed` - Current index
- `GET /market/fear-greed/history` - Historical data

**Features:**
- Gauge chart display
- Component breakdown
- Historical trend chart
- Advisory recommendations
- Comparison with market performance

### 3.5 Sentiment Tracker Page
**Path:** `/market/sentiment`

**Required APIs:**
- `GET /market/sentiment` - Overall sentiment
- `GET /news/analysis?period=...` - News sentiment
- `GET /market/sentiment/history` - Sentiment history

**Features:**
- Sentiment gauge
- Stock-specific sentiment
- News sentiment timeline
- Breadth analysis
- Indicator dashboard

---

## 4. News Analysis Page

**Path:** `/news-analysis`

**Access Level:** User / Premium

### Required APIs
- `GET /news/list` - News list
- `GET /news/analysis` - News aggregated analysis
- `GET /news/stock/{symbol}` - Stock-specific news

### Key Features

**News Display:**
- Chronological feed
- Sentiment indicators
- Category filtering
- Importance ranking
- Source credibility

**Analysis Tools:**
- News sentiment trend
- Keyword frequency analysis
- Stock mention network
- Sentiment by sector
- News impact on price

**Word Cloud:**
- Most mentioned terms
- Sentiment-colored words
- Interactive exploration

---

## 5. China-Specific Features Pages

### 5.1 North Money Flow Page (沪深港通)
**Path:** `/china-features/north-money-flow`

**Required APIs:**
- `GET /china-features/north-money-flow` - Flow data
- `GET /china-features/north-money-flow?symbol=...` - Stock-specific flow

**Features:**
- Shanghai/Shenzhen connect flows
- Balance remaining indicators
- Top buyers/sellers
- Daily/weekly/monthly trends
- Net flow analysis

### 5.2 Long Hu Bang Page (龙虎榜)
**Path:** `/china-features/long-hu-bang`

**Required APIs:**
- `GET /china-features/long-hu-bang` - Current rankings
- `GET /china-features/long-hu-bang?date=...` - Historical data

**Features:**
- Top movers list
- Reason for ranking
- Buyer/seller details
- Retail vs institutional
- Trading patterns

### 5.3 Margin Trading Page
**Path:** `/china-features/margin-trading`

**Required APIs:**
- `GET /china-features/margin-trading` - Margin data
- `GET /china-features/margin-trading?symbol=...` - Stock-specific margin

**Features:**
- Margin balance tracking
- Short selling volume
- Margin ratio analysis
- Leverage utilization
- Historical trends

### 5.4 Concept Sectors Page
**Path:** `/china-features/concepts`

**Required APIs:**
- `GET /china-features/concepts` - Concept data
- `GET /china-features/concepts/{conceptId}/stocks` - Concept stocks

**Features:**
- Concept ranking
- Sector rotation by concept
- Concept stocks table
- Performance tracking
- Concept news

---

## 6. Industry Analysis Page

**Path:** `/industry`

**Access Level:** User / Premium

### Required APIs
- `GET /industry/list` - Industry list
- `GET /industry/{industryId}` - Industry details
- `GET /industry/{industryId}/stocks` - Industry stocks
- `GET /market/sector-performance` - Performance data

### Key Features

**Industry Overview:**
- Industry rankings by performance
- Number of stocks per industry
- Market cap distribution
- Valuation metrics comparison
- Growth metrics

**Detailed Analysis:**
- Sector rotation in industry
- Key stocks and their performance
- Financial metrics comparison
- Industry news and events
- Analyst ratings distribution

---

## 7. Options Analysis Page (Premium)

**Path:** `/options`

**Access Level:** Premium

### Required APIs
- `GET /stock/options/{symbol}/chain` - Options chain
- `GET /stock/options/{symbol}/greeks` - Greeks data
- `GET /stock/options/{symbol}/volatility` - Volatility data
- `POST /options/calculator` - Options pricing

### Key Features

**Options Chain:**
- Calls and puts table
- Strike selection
- Bid-ask spreads
- Volume and open interest
- Implied volatility by strike

**Greeks Analysis:**
- Delta, Gamma, Theta, Vega display
- Greeks chart over price range
- Sensitivity analysis

**Volatility Analysis:**
- IV skew chart
- Historical volatility
- Implied volatility term structure

**Options Calculator:**
- Black-Scholes pricing
- Scenario analysis
- Greeks calculation
- Strategy payoff diagrams

---

## 8. Earnings & Economic Calendar

**Path:** `/calendar`

**Access Level:** User / Premium

### Required APIs
- `GET /calendar/earnings` - Earnings events
- `GET /calendar/dividends` - Dividend events
- `GET /calendar/economic` - Economic events

### Key Features

**Calendar Views:**
- Monthly calendar view
- List view
- Upcoming events sorting
- Filter by type and importance

**Event Details:**
- Event description
- Previous/forecast/actual values
- Affected stocks
- Historical impact analysis

**Reminders:**
- Set event reminders
- Email notifications
- Calendar integration

---

## Error Handling

- Invalid filters: Show validation errors
- No results: Show alternative suggestions
- Data unavailable: Display cached data if available
- API errors: Retry with exponential backoff
