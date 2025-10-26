# Stock Detail Page

## Overview
Comprehensive stock analysis page displaying detailed information about a specific stock including quotes, charts, financials, news, and technical analysis.

**Path:** `/stock/:symbol`

**Access Level:** Guest (Limited) / User / Premium (Full)

---

## Main Sections

### 1. Price Card / Header
Displays real-time price information and key metrics.

**Required APIs:**
- `GET /stock/quote/{symbol}` - Real-time quote
- `GET /stock/info/{symbol}` - Basic stock information
- WebSocket for price updates (optional but recommended)

**Data Displayed:**
- Current price, change, and change percent
- Market cap, P/E, P/B ratios
- 52-week high/low
- Average volume and turnover
- Market status indicator

**Features:**
- Real-time price ticker
- Customizable price alert creation
- Add to watchlist button
- Share functionality

---

### 2. Chart Panel
Interactive K-line chart with multiple timeframes and indicators.

**Required APIs:**
- `GET /stock/chart/{symbol}?period={period}&interval={interval}` - Historical candle data
- `GET /stock/timeshare/{symbol}` - Intraday time share data

**Data Displayed:**
- K-line chart (open, high, low, close)
- Volume bars
- Technical indicators (configurable)
- Multiple timeframes: 1D, 5D, 1M, 3M, 6M, 1Y, YTD, MAX

**Features:**
- Zoom and pan capabilities
- Technical indicators overlay
- Drawing tools (trendline, support/resistance)
- Indicator library (MA, MACD, RSI, Bollinger Bands, etc.)

---

### 3. Info Panel
Company information and key details.

**Required APIs:**
- `GET /stock/info/{symbol}` - Company details
- `GET /stock/shareholders/{symbol}` - Major shareholders

**Data Displayed:**
- Company name and sector/industry
- Listing date and market
- Website and contact information
- Company description
- Market capitalization
- Circulating and total shares
- Major shareholders (top 10)

**Features:**
- Copy company details
- Website link
- Related concept sectors

---

### 4. Financial Panel
Detailed financial statements and metrics.

**Required APIs:**
- `GET /stock/financial/{symbol}?periods=4` - Financial metrics
- `/stock/financial-statements` - Detailed statements

**Sub-tabs:**
- **Income Statement:** Revenue, net income, margins
- **Balance Sheet:** Assets, liabilities, equity
- **Cash Flow:** Operating, investing, financing cash flows
- **Ratios:** P/E, P/B, ROE, ROA, debt ratios

**Features:**
- Multiple reporting periods comparison
- Year-over-year comparison
- Quarterly vs annual view
- Chart visualization of key metrics

---

### 5. Valuation Analysis
DCF and valuation metrics.

**Required APIs:**
- `POST /stock/dcf-valuation/{symbol}` - DCF model
- `GET /stock/valuation-metrics/{symbol}` - Industry comparisons

**Data Displayed:**
- DCF intrinsic value estimate
- Fair value range
- Valuation multiples vs peers
- Industry average comparisons

**Features:**
- DCF model customization
- Scenario analysis
- Peer comparison table

---

### 6. Dividend Panel
Dividend history and future payments.

**Required APIs:**
- `GET /stock/dividends/{symbol}` - Dividend history
- `GET /calendar/dividends?symbol={symbol}` - Upcoming dividends

**Data Displayed:**
- Historical dividend payments
- Dividend per share
- Dividend yield
- Payout ratio
- Ex-dividend and payment dates
- Upcoming dividend schedule

**Features:**
- Dividend history chart
- Yield calculation
- Reinvestment calculator

---

### 7. Shareholder Panel
Shareholder composition and trading activity.

**Required APIs:**
- `GET /stock/shareholders/{symbol}` - Shareholder list
- `GET /stock/insider-trading/{symbol}` - Insider trades

**Data Displayed:**
- Major shareholders (individuals and institutions)
- Shareholding percentage
- Shareholding changes
- Insider trading activity
- Executive stock holdings

**Features:**
- Shareholding trend chart
- Insider trading timeline
- Transaction details modal

---

### 8. News Panel
Latest news and announcements.

**Required APIs:**
- `GET /news/stock/{symbol}` - Stock-specific news
- `GET /stock/announcements/{symbol}` - Official announcements

**Data Displayed:**
- Recent news articles (title, summary, source, date)
- Sentiment analysis (positive/negative/neutral)
- Importance rating
- Official announcements and disclosures
- Earnings announcements

**Features:**
- News filters (category, importance)
- Read full article link
- News sentiment timeline

---

### 9. Technical Analysis Panel (Premium)
Advanced technical analysis tools.

**Required APIs:**
- `GET /stock/technical-signals/{symbol}` - Technical signals
- `GET /stock/support-resistance/{symbol}` - Key levels

**Data Displayed:**
- Technical signals (buy/sell/hold)
- Support and resistance levels
- Key technical levels
- Volume analysis
- Pattern recognition results

**Features:**
- Customizable signal rules
- Price level alerts

---

### 10. Options Panel (if available)
Options data for US-listed stocks.

**Required APIs:**
- `GET /stock/options/{symbol}/chain` - Options chain
- `GET /stock/options/{symbol}/greeks` - Greeks data

**Data Displayed:**
- Options chain (calls/puts)
- Greeks (delta, gamma, theta, vega)
- Implied volatility
- Open interest and volume

**Features:**
- Options chain filtering and sorting
- Greeks visualization
- Volatility smile chart

---

### 11. Comparison
Compare with other stocks.

**Required APIs:**
- `POST /stock/compare` - Multiple stock comparison

**Features:**
- Select comparison stocks
- Compare key metrics side-by-side
- Performance comparison chart

---

## Page Functionality

### Real-time Updates
- Price updates via WebSocket
- Automatic chart refresh during market hours
- News feed updates

### Watchlist Management
- Add/remove from watchlist
- Create price alerts
- Set target price

### Data Export
- Export financial data to CSV
- Export chart to image
- Generate PDF report

### Responsive Design
- Mobile-optimized layout
- Touch-friendly interactive elements
- Responsive chart sizing

---

## Performance Considerations

1. **Lazy Loading:** Load panels on demand
2. **Chart Optimization:** Limit data points for different timeframes
3. **WebSocket:** Use for real-time price updates
4. **Caching:** Cache historical data appropriately
5. **Pagination:** Use for large datasets (news, shareholders)

---

## Error Handling

- Invalid stock symbol: Show 404 page with search suggestion
- Data unavailable: Show placeholder with retry option
- Network error: Show offline indicator with cached data
