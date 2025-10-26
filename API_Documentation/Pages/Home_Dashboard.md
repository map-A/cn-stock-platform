# Home / Dashboard Page

## Overview
Main landing page for logged-in users showing personalized market overview, portfolio summary, watchlist, and news.

**Path:** `/`

**Access Level:** User / Premium

---

## Main Sections

### 1. Market Overview Widget
Quick snapshot of major indices and market status.

**Required APIs:**
- `GET /market/overview` - Market status and indices
- `GET /market/movers?type=gainers&limit=5` - Top gainers
- `GET /market/movers?type=decliners&limit=5` - Top decliners

**Data Displayed:**
- Major indices (SSE, SZSE, HSI, SPX)
- Market status (open/closed/pre-market)
- Market trend indicator
- Top 5 gainers and decliners
- Daily market summary

**Features:**
- Click to see detailed index data
- Market status indicator
- Auto-refresh market data

---

### 2. Portfolio Summary Widget
User's portfolio performance at a glance.

**Required APIs:**
- `GET /portfolio/list?includeDetails=false` - User portfolios
- `GET /portfolio/{portfolioId}` - Detailed portfolio data

**Data Displayed:**
- Total portfolio value
- Total return (amount and percent)
- Today's gain/loss
- Asset allocation (pie chart)
- Holdings count

**Features:**
- Click to go to portfolio page
- Portfolio selector (if multiple)
- Performance trend mini chart

---

### 3. Watchlist Widget
Quick view of watched stocks.

**Required APIs:**
- `GET /watchlist/lists` - User watchlists
- `GET /watchlist/lists/{watchlistId}/stocks?pageSize=10` - Watchlist stocks

**Data Displayed:**
- Default watchlist stocks (top 10)
- Symbol, name, current price, change
- Stock performance mini chart
- Add stock quick button

**Features:**
- Click stock to view details
- Quick add/remove from watchlist
- Sort by performance
- Multiple watchlist selector

---

### 4. News Feed Widget
Latest market and stock news.

**Required APIs:**
- `GET /news/list?category=market&pageSize=10&days=7` - Market news
- `GET /news/analysis?period=1w&topN=5` - News analysis

**Data Displayed:**
- Recent news headlines
- News sentiment (positive/negative/neutral)
- Source and publication time
- News category tags
- Importance rating

**Features:**
- Click to read full article
- Filter by category
- Hide dismissed news
- Sentiment filter

---

### 5. Market Sentiment Indicator
Overall market sentiment and analysis.

**Required APIs:**
- `GET /market/sentiment` - Market sentiment
- `GET /market/fear-greed` - Fear & Greed index

**Data Displayed:**
- Fear & Greed index gauge
- Market sentiment score (bullish/bearish/neutral)
- Breadth indicators
- Advance/decline ratio
- Volume analysis

**Features:**
- Historical sentiment chart
- Indicator tooltips

---

### 6. Sector Performance
Current sector performance ranking.

**Required APIs:**
- `GET /market/sector-performance` - Sector performance data
- `GET /market/sector-rotation?period=1m` - Sector rotation

**Data Displayed:**
- Sector rankings by performance
- Sector change percentage
- Number of gainers/decliners
- Sector volume

**Features:**
- Click to view sector details
- Sort by different metrics
- Historical performance comparison

---

### 7. Economic Calendar Widget
Upcoming economic events and earnings.

**Required APIs:**
- `GET /calendar/economic?startDate={today}&endDate={next7days}&importance=3` - High importance events
- `GET /calendar/earnings?startDate={today}&endDate={next7days}&limit=5` - Upcoming earnings
- `GET /calendar/dividends?startDate={today}&endDate={next30days}&limit=5` - Upcoming dividends

**Data Displayed:**
- Next economic announcements
- Upcoming earnings reports
- Dividend payment dates
- Event importance and impact
- Previous value, forecast, actual

**Features:**
- Filter by importance
- Set reminders
- Click to add to calendar

---

### 8. Quick Actions Bar
Fast access to common functions.

**Available Actions:**
- Search stock
- Create price alert
- Add to portfolio
- Create strategy
- View watchlist
- Portfolio settings

**Features:**
- Keyboard shortcuts
- Customizable quick actions

---

## Page Functionality

### Real-time Updates
- Auto-refresh market data every 5 seconds during market hours
- WebSocket updates for price changes
- News feed auto-update
- Sentiment indicator live updates

### Personalization
- Reorder widgets (drag and drop)
- Hide/show widgets
- Customize update frequency
- Set favorite indices
- Portfolio selector for different views

### Data Export
- Export portfolio summary to PDF
- Export watchlist to CSV
- Export news to email digest

### Responsive Design
- Mobile-first design
- Widget stacking on mobile
- Touch-friendly controls
- Simplified view for small screens

---

## Performance Considerations

1. **Lazy Loading:** Load widgets on demand
2. **Data Caching:** Cache market data for 30 seconds
3. **Progressive Loading:** Show cached data first, update from server
4. **Pagination:** Limited data in feed widgets
5. **Image Optimization:** Compressed chart images

---

## Default Widget Order (Customizable)

1. Market Overview
2. Portfolio Summary
3. Market Sentiment
4. Watchlist
5. Sector Performance
6. News Feed
7. Economic Calendar
8. Quick Actions

---

## Mobile Specific Considerations

- Simplified layout with fewer widgets
- Collapsible sections
- Swipeable widget carousel
- Optimized touch targets (min 44x44px)
- Responsive font sizing
