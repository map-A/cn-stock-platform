# API Documentation Index

Welcome to the CN Stock Platform API Documentation. This document serves as a comprehensive guide to all backend services required for the platform.

---

## 📋 Documentation Structure

### 1. [Authentication & Authorization](./Auth/Authentication.md)
Complete authentication flow documentation including:
- User registration and login
- Token management and refresh
- Password reset and 2FA
- Permission models and access control
- Security requirements

**Key Endpoints:**
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- POST `/auth/refresh` - Token refresh
- POST `/auth/password-reset-request` - Password reset
- GET `/auth/verify-email` - Email verification

---

### 2. Services Documentation

#### [Stock Service](./Services/Stock.md)
Real-time and historical stock data including quotes, charts, financials.

**Key Endpoints:**
- GET `/stock/quote/{symbol}` - Real-time quote
- GET `/stock/info/{symbol}` - Company information
- GET `/stock/chart/{symbol}` - Historical chart data
- GET `/stock/financial/{symbol}` - Financial metrics
- GET `/stock/shareholders/{symbol}` - Shareholder info
- GET `/stock/news/{symbol}` - Stock news
- GET `/stock/dividends/{symbol}` - Dividend history
- POST `/stock/compare` - Compare multiple stocks
- GET `/stock/search` - Search stocks
- GET `/stock/hot` - Hot stocks
- GET `/stock/insider-trading/{symbol}` - Insider trading

#### [Portfolio & Watchlist Service](./Services/Portfolio.md)
User portfolio management and watchlist functionality.

**Key Endpoints:**
- GET/POST `/watchlist/lists` - Watchlist management
- GET/POST/PUT/DELETE `/watchlist/lists/{watchlistId}/stocks` - Stock management
- GET/POST `/portfolio/list` - Portfolio CRUD
- GET `/portfolio/{portfolioId}` - Portfolio details
- POST `/portfolio/{portfolioId}/holdings` - Add holdings
- GET `/portfolio/{portfolioId}/holdings` - List holdings
- GET `/portfolio/{portfolioId}/performance` - Performance metrics
- GET `/portfolio/{portfolioId}/allocation` - Asset allocation
- POST `/portfolio/{portfolioId}/transactions` - Record transactions

#### [Strategy & Backtesting Service](./Services/Strategy.md)
Strategy creation, management, and backtesting engine.

**Key Endpoints:**
- GET/POST `/strategy/list` - Strategy management
- GET `/strategy/get/{strategyId}` - Strategy details
- POST `/strategy/create` - Create strategy
- PUT `/strategy/update/{strategyId}` - Update strategy
- DELETE `/strategy/delete/{strategyId}` - Delete strategy
- POST `/backtest/create` - Create backtest
- GET `/backtest/get/{backtestId}` - Backtest status
- GET `/backtest/result/{backtestId}` - Backtest results
- POST `/strategy/{strategyId}/optimize` - Parameter optimization

#### [Market Analysis Service](./Services/Market.md)
Market data, analysis, news, and China-specific features.

**Key Endpoints:**
- GET `/market/overview` - Market overview
- GET `/market/sector-performance` - Sector performance
- GET `/market/sector-rotation` - Sector rotation
- GET `/market/sentiment` - Market sentiment
- GET `/market/fear-greed` - Fear & Greed index
- GET `/market/heatmap` - Market heatmap
- GET `/market/money-flow` - Money flow analysis
- GET `/market/movers` - Top gainers/decliners
- GET `/news/list` - News feed
- GET `/news/stock/{symbol}` - Stock news
- GET `/news/analysis` - News analysis
- GET `/calendar/earnings` - Earnings calendar
- GET `/calendar/dividends` - Dividend calendar
- GET `/calendar/economic` - Economic calendar
- GET `/china-features/north-money-flow` - North money flow
- GET `/china-features/long-hu-bang` - Long Hu Bang
- GET `/china-features/margin-trading` - Margin trading
- GET `/china-features/concepts` - Concept sectors

---

### 3. Pages Documentation

#### [Stock Detail Page](./Pages/Stock_Detail.md)
Comprehensive stock analysis page with multiple analysis panels.

**Sections:**
1. Price Card / Header
2. Chart Panel
3. Info Panel
4. Financial Panel
5. Valuation Analysis
6. Dividend Panel
7. Shareholder Panel
8. News Panel
9. Technical Analysis Panel
10. Options Panel
11. Comparison

#### [Home / Dashboard Page](./Pages/Home_Dashboard.md)
Main dashboard with personalized market overview and portfolio summary.

**Widgets:**
1. Market Overview
2. Portfolio Summary
3. Watchlist
4. News Feed
5. Market Sentiment
6. Sector Performance
7. Economic Calendar
8. Quick Actions

#### [Analysis & Tools Pages](./Pages/Analysis_Tools.md)
Advanced market analysis tools and research features.

**Pages Included:**
1. Stock Screener
2. Risk Management
3. Sector Rotation
4. Market Heatmap
5. Money Flow Analysis
6. Fear & Greed Index
7. Sentiment Tracker
8. News Analysis
9. China Features (North Money Flow, Long Hu Bang, Margin Trading, Concepts)
10. Industry Analysis
11. Options Analysis
12. Earnings & Economic Calendar

#### [User Account & Settings Pages](./Pages/User_Account_Settings.md)
User profile, settings, and account management.

**Pages Included:**
1. User Profile
2. Account Settings
3. Security Settings
4. Privacy Settings
5. Notification Settings
6. Membership & Subscription
7. Notifications Center
8. Activity & History
9. Device Management
10. Data Export & Backup
11. API Keys & Integration

#### [Complete Feature Inventory](./Pages/Complete_Feature_Inventory.md)
Comprehensive list of all pages, components, and features organized by category.

---

### 4. Data Models & Types

#### [Data Models Reference](./DataModels/Types.md)
Complete TypeScript interface definitions for all data models.

**Model Categories:**
1. User Models
   - User
   - UserProfile
   - UserPreferences

2. Stock Models
   - StockQuote
   - StockInfo
   - StockChart / Candle
   - FinancialMetrics
   - ShareholderInfo

3. Portfolio Models
   - Portfolio
   - Holding
   - Transaction
   - PortfolioMetrics

4. Strategy Models
   - Strategy
   - Parameter
   - Rule
   - RiskManagement
   - Backtest
   - BacktestSummary
   - BacktestTrade

5. Watchlist Models
   - Watchlist
   - WatchlistItem

6. Market Models
   - News
   - MarketOverview
   - Sentiment
   - Index

7. Common Types & Enums
   - API Response formats
   - Error handling
   - Enumerations

---

## 🚀 Getting Started

### For Frontend Developers

1. **Start with Authentication:**
   - Read [Authentication.md](./Auth/Authentication.md)
   - Understand login/registration flow
   - Implement token management

2. **Explore Main Pages:**
   - Review [Home_Dashboard.md](./Pages/Home_Dashboard.md)
   - Check [Stock_Detail.md](./Pages/Stock_Detail.md)
   - Browse [Analysis_Tools.md](./Pages/Analysis_Tools.md)

3. **Understand Data Models:**
   - Study [Types.md](./DataModels/Types.md)
   - Review common data structures
   - Understand API response formats

4. **Reference Services:**
   - Check specific service docs for API endpoints
   - Verify required parameters and response formats
   - Implement error handling

### For Backend Developers

1. **Review API Endpoints:**
   - Start with [Stock.md](./Services/Stock.md)
   - Progress through other services
   - Implement endpoints in listed order

2. **Understand Data Models:**
   - Study all data models in [Types.md](./DataModels/Types.md)
   - Create database schemas matching models
   - Implement validation rules

3. **Implement Authentication:**
   - Implement user registration
   - Create login endpoint with token generation
   - Build refresh token mechanism
   - Add 2FA support

4. **Data Integration:**
   - Connect to stock data providers
   - Implement real-time data feeds
   - Cache appropriately
   - Handle rate limiting

### For DevOps/Infrastructure

1. **System Architecture:**
   - Review [Complete_Feature_Inventory.md](./Pages/Complete_Feature_Inventory.md)
   - Understand system components
   - Plan infrastructure

2. **Data Requirements:**
   - Real-time stock data
   - Historical time series data
   - News and announcements
   - Market indices
   - Economic calendar

3. **Performance Considerations:**
   - Real-time data updates
   - WebSocket connections
   - Chart data optimization
   - Caching strategy

---

## 📊 API Endpoints Quick Reference

### Authentication
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`
- POST `/auth/password-reset-request`
- POST `/auth/password-reset`
- POST `/auth/change-password`
- POST `/auth/send-verification-email`
- POST `/auth/verify-email`

### Stock Quotes & Information
- GET `/stock/quote/{symbol}`
- POST `/stock/quotes`
- GET `/stock/info/{symbol}`
- GET `/stock/chart/{symbol}`
- GET `/stock/timeshare/{symbol}`
- GET `/stock/search`
- GET `/stock/hot`
- GET `/stock/financial/{symbol}`
- GET `/stock/shareholders/{symbol}`
- GET `/stock/news/{symbol}`
- GET `/stock/announcements/{symbol}`
- GET `/stock/insider-trading/{symbol}`
- GET `/stock/dividends/{symbol}`
- GET `/stock/splits/{symbol}`
- POST `/stock/compare`

### Portfolio & Watchlist
- GET/POST `/watchlist/lists`
- PUT/DELETE `/watchlist/lists/{watchlistId}`
- GET/POST/PUT/DELETE `/watchlist/lists/{watchlistId}/stocks`
- GET/POST `/portfolio/list`
- GET/PUT/DELETE `/portfolio/{portfolioId}`
- POST `/portfolio/{portfolioId}/holdings`
- PUT/DELETE `/portfolio/{portfolioId}/holdings/{holdingId}`
- GET `/portfolio/{portfolioId}/holdings/{holdingId}/history`
- GET `/portfolio/{portfolioId}/performance`
- GET `/portfolio/{portfolioId}/allocation`
- GET `/portfolio/{portfolioId}/risk-metrics`
- POST `/portfolio/{portfolioId}/transactions`

### Strategy & Backtesting
- GET/POST `/strategy/list`
- GET `/strategy/get/{strategyId}`
- POST `/strategy/create`
- PUT `/strategy/update/{strategyId}`
- DELETE `/strategy/delete/{strategyId}`
- POST `/strategy/{strategyId}/clone`
- POST `/strategy/{strategyId}/publish`
- POST `/backtest/create`
- GET `/backtest/get/{backtestId}`
- GET `/backtest/result/{backtestId}`
- GET `/backtest/list`
- DELETE `/backtest/{backtestId}`
- POST `/strategy/{strategyId}/optimize`
- GET `/strategy/{strategyId}/performance`

### Market Data
- GET `/market/overview`
- GET `/market/sector-performance`
- GET `/market/sector-rotation`
- GET `/market/sentiment`
- GET `/market/fear-greed`
- GET `/market/heatmap`
- GET `/market/money-flow`
- GET `/market/movers`
- GET `/news/list`
- GET `/news/stock/{symbol}`
- GET `/news/analysis`
- GET `/calendar/earnings`
- GET `/calendar/dividends`
- GET `/calendar/economic`
- GET `/china-features/north-money-flow`
- GET `/china-features/long-hu-bang`
- GET `/china-features/margin-trading`
- GET `/china-features/concepts`

### User Account
- GET/PUT `/user/profile`
- GET/PUT `/user/settings`
- POST `/user/settings/verify-email`
- POST `/user/settings/2fa/enable`
- POST `/user/settings/2fa/disable`
- GET `/subscription/plans`
- GET `/subscription/current`
- POST `/subscription/upgrade`
- GET `/notification/list`
- PUT `/notification/{notificationId}/read`
- GET `/user/devices`
- DELETE `/user/devices/{deviceId}`
- GET `/user/api-keys`
- POST `/user/api-keys`
- DELETE `/user/api-keys/{keyId}`

---

## 🔒 Security & Best Practices

### Authentication
- All endpoints (except login/register/password-reset) require `Authorization: Bearer {token}` header
- Tokens should expire after 1 hour
- Refresh tokens valid for 30 days
- Implement rate limiting on login attempts
- Use HTTPS for all API communication

### Data Privacy
- Encrypt sensitive user data in transit and at rest
- Implement role-based access control (RBAC)
- Audit log all data access
- Comply with data protection regulations
- Allow users to export their data

### API Security
- Validate all input data
- Implement CORS properly
- Use rate limiting for all endpoints
- Implement request signing for sensitive operations
- Log all API access attempts

---

## 📞 Support & Contact

For questions about these API specifications:
1. Review the specific service documentation
2. Check the data models for structure details
3. Consult the error codes section
4. Review related page documentation

---

## 📝 Document Version

- Version: 1.0
- Last Updated: 2024-10-26
- Platform: CN Stock Platform
- Scope: Complete API and Frontend Specification

---

## 🎯 Implementation Phases

### Phase 1: Core (Weeks 1-4)
- ✅ Authentication system
- ✅ Stock quote and information APIs
- ✅ Basic watchlist functionality
- ✅ Portfolio management basics

### Phase 2: Analysis (Weeks 5-8)
- Stock screener
- Technical indicators
- Financial analysis
- Risk management

### Phase 3: Advanced (Weeks 9-12)
- Strategy system
- Backtesting engine
- Options analysis
- Market sentiment

### Phase 4: Community (Weeks 13-16)
- Strategy marketplace
- Community features
- Social features

### Phase 5: Polish (Weeks 17+)
- Admin dashboard
- Performance optimization
- Additional analysis tools
- Premium features

---

**Navigation:** [README](./README.md) | [Auth](./Auth/Authentication.md) | [Services](./Services/) | [Pages](./Pages/) | [Data Models](./DataModels/Types.md)
