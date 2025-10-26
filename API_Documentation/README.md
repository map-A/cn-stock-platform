# CN Stock Platform - API Documentation

This directory contains comprehensive documentation for all pages, components, and required backend functionalities for the CN Stock Platform.

## Directory Structure

```
API_Documentation/
├── Pages/                  # Page-level functionality documentation
├── Components/             # Reusable component documentation
├── Services/               # Backend service requirements
├── Auth/                   # Authentication and authorization
├── DataModels/             # Data structures and types
└── README.md              # This file
```

## Quick Navigation

### Core Features
1. **Authentication & User Management** - Login, registration, profile management
2. **Stock Management** - Quote, history, search, analysis
3. **Portfolio Management** - Watchlist, holdings, performance tracking
4. **Market Analysis** - Sector rotation, sentiment analysis, fear & greed index
5. **Trading & Risk Management** - Trade history, risk analysis, compliance
6. **Strategy & Backtesting** - Strategy creation, backtesting, performance analysis
7. **Options Trading** - Options chain, greeks, volatility analysis
8. **China-specific Features** - Long Hu Bang, North money flow, margin trading
9. **Community Features** - Chat, learning center, news flow
10. **Admin & System Settings** - System configuration, permissions, data sources

## Document Overview

- **Pages/**: Individual documentation for each major page and its features
- **Components/**: Detailed descriptions of reusable components and their API requirements
- **Services/**: Backend service specifications and endpoint descriptions
- **Auth/**: Authentication flow and authorization requirements
- **DataModels/**: TypeScript interfaces and data structures

## Common API Patterns

### Authentication
- All API endpoints (except login/register) require Authorization header
- Token format: `Authorization: Bearer {token}`

### Response Format
```json
{
  "code": 200,
  "message": "Success",
  "data": {}
}
```

### Pagination
- Supported query parameters: `page`, `pageSize` (default 20)
- Response includes: `total`, `page`, `pageSize`, `items`

## Getting Started

1. Start with **Auth/Authentication.md** for user login/registration flow
2. Review **Services/** for all available API endpoints
3. Check **DataModels/** for data structures
4. Browse **Pages/** for page-specific requirements
5. Refer to **Components/** for reusable component specifications
