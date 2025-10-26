# User Account & Settings Pages

## 1. User Profile Page

**Path:** `/user/profile`

**Access Level:** User (Own profile) / Premium (View others' public profiles)

### Required APIs
- `GET /user/profile` - Current user profile
- `GET /user/profile/{userId}` - Other user's public profile
- `PUT /user/profile` - Update profile

### Key Features

**Profile Information:**
- Avatar/profile picture
- Full name and bio
- Email address
- Phone number
- Social media links
- Location
- Account creation date

**User Statistics (Premium):**
- Total portfolio value
- Total return ($ and %)
- Trading win rate
- Total trades
- Average trade profit
- Public strategies count
- Followers count

**Actions:**
- Edit profile
- Change avatar
- View public strategies
- Follow/unfollow user
- Message (if community feature enabled)

---

## 2. User Settings Page

**Path:** `/user/settings`

**Access Level:** User

### Required APIs
- `GET /user/settings` - User settings
- `PUT /user/settings` - Update settings
- `POST /user/settings/verify-email` - Email verification
- `POST /user/settings/2fa/enable` - 2FA setup
- `POST /user/settings/2fa/disable` - Disable 2FA

### Sub-sections

#### A. Account Settings
**Features:**
- Email address (primary and secondary)
- Phone number
- Language preference (中文/English)
- Currency preference (CNY/USD)
- Timezone
- Email verification status
- Delete account option

#### B. Security Settings
**Features:**
- Change password
- Password strength indicator
- Last login history
- Active sessions list
- Logout other sessions
- Two-factor authentication (2FA)
  - SMS-based
  - Email-based
  - Authenticator app
- Recovery codes backup

#### C. Privacy Settings
**Features:**
- Profile visibility (public/private)
- Strategy visibility
- Portfolio visibility
- Activity visibility
- Block list management
- Data collection preferences

#### D. Notification Settings
**Features:**
- Email notifications toggle
- Push notifications toggle
- SMS notifications toggle
- Notification frequency (real-time/daily/weekly)
- Notification categories:
  - Price alerts
  - News alerts
  - Earnings announcements
  - Dividend announcements
  - Portfolio changes
  - System notifications
- Quiet hours configuration

#### E. Theme & Display
**Features:**
- Light/Dark/Auto theme
- Font size adjustment
- Chart default settings
- Data refresh frequency
- Price precision (decimal places)
- Thousands separator

#### F. Preference Settings
**Features:**
- Default watchlist
- Default portfolio
- Default view (grid/list)
- Market data source preference
- Data freshness preference (real-time/delayed)

---

## 3. Membership & Subscription Page

**Path:** `/user/membership`

**Access Level:** User

### Required APIs
- `GET /subscription/plans` - Available subscription plans
- `GET /subscription/current` - Current subscription
- `POST /subscription/upgrade` - Upgrade subscription
- `POST /subscription/cancel` - Cancel subscription
- `GET /subscription/billing-history` - Billing history
- `POST /subscription/payment-method` - Update payment method

### Key Features

**Subscription Plans Display:**
- Free tier
- Basic tier
- Premium tier
- Pricing comparison table
- Feature comparison
- Trial availability
- Money-back guarantee info

**Current Subscription Status:**
- Current plan
- Billing date
- Renewal date
- Auto-renew status
- Price
- Features included
- Tokens/credits remaining

**Billing Management:**
- Payment methods
- Billing address
- Tax information
- Invoices and receipts
- Billing history
- Upgrade/downgrade options
- Cancel subscription

**Pricing Card Component:**
- Plan name and price
- Feature list
- "Choose Plan" button
- Badge (Popular, Recommended, Current)

**Payment Modal:**
- Payment method selection
- Credit card form
- Payment processor integration
- Order confirmation
- Invoice generation

---

## 4. Notifications Page

**Path:** `/user/notifications`

**Access Level:** User

### Required APIs
- `GET /notification/list` - Notification list
- `PUT /notification/{notificationId}/read` - Mark as read
- `DELETE /notification/{notificationId}` - Delete notification
- `PUT /notification/read-all` - Mark all as read

### Key Features

**Notification List:**
- Chronological list
- Unread badge
- Notification type indicator
- Time of notification
- Summary text
- Related stock/portfolio link

**Notification Filtering:**
- By type (price alert, news, system)
- By date range
- Unread only
- Read only

**Actions:**
- Mark as read/unread
- Delete single notification
- Delete all notifications
- Click to view details
- Related action button

**Notification Types:**
- Price alerts triggered
- News updates
- Earnings announcements
- Portfolio changes
- System announcements
- Feature updates

---

## 5. Activity & History Page

**Path:** `/user/activity`

**Access Level:** User

### Required APIs
- `GET /user/activity/login-history` - Login attempts
- `GET /user/activity/changes-history` - Profile/settings changes
- `GET /user/activity/trades-history` - Trading history
- `GET /user/activity/watchlist-history` - Watchlist changes

### Features

**Login History:**
- Timestamp
- Device information
- IP address
- Location (if available)
- Success/failure indicator
- Current session indicator

**Changes History:**
- What was changed
- Old value / New value
- When changed
- From which device

**Trades History:**
- Transaction date and time
- Symbol and quantity
- Buy/sell price
- Commission
- Total amount
- Portfolio name

**Watchlist Changes:**
- Stock added/removed
- Date/time
- Watchlist name

---

## 6. Device Management Page

**Path:** `/user/devices`

**Access Level:** User

### Required APIs
- `GET /user/devices` - Connected devices
- `DELETE /user/devices/{deviceId}` - Remove device
- `PUT /user/devices/{deviceId}` - Rename device
- `POST /user/devices/logout-all` - Logout all devices

### Features

**Device List:**
- Device name (auto-detected or custom)
- Device type (web, mobile, tablet)
- Operating system
- Browser
- IP address
- Location
- Last accessed time
- Is current device indicator

**Actions:**
- Rename device
- Remove device
- Logout specific device
- Logout all other devices

---

## 7. Data Export & Backup

**Path:** `/user/data`

**Access Level:** User / Premium

### Required APIs
- `POST /user/data/export` - Export user data
- `POST /user/data/backup` - Create backup
- `GET /user/data/backups` - List backups
- `POST /user/data/restore` - Restore from backup

### Features

**Data Export:**
- Export all user data
- Export format selection (JSON, CSV)
- Email export link
- Download directly
- Scheduled exports

**Backup Management:**
- Create backup
- List backups with dates
- Restore from backup
- Delete backup
- Automatic daily backups (Premium)
- Backup storage info

**Exportable Data:**
- Portfolio data
- Transaction history
- Watchlist data
- Strategies
- Backtest results
- Settings

---

## 8. API Keys & Integration

**Path:** `/user/api-keys`

**Access Level:** User / Premium

### Required APIs
- `GET /user/api-keys` - List API keys
- `POST /user/api-keys` - Generate new key
- `DELETE /user/api-keys/{keyId}` - Revoke key
- `PUT /user/api-keys/{keyId}` - Update key permissions

### Features

**API Keys List:**
- Key ID (masked)
- Created date
- Last used date
- Permissions scope
- Enabled/disabled status
- Rate limit info

**Create New Key:**
- Name
- Description
- Select permissions
- Expiration date
- IP whitelist (optional)

**Key Management:**
- Copy key to clipboard
- Regenerate key
- Revoke key
- Update permissions
- Set expiration date

---

## General Page Features

### Security Indicators
- SSL/TLS status
- Data encryption status
- Last security scan date
- Security recommendations

### Account Safety
- Unusual activity alerts
- Login notifications
- Device approval requests
- Security questions recovery option

### Help & Support
- Help links
- FAQ
- Contact support
- Report security issue

---

## Error Handling

- Validation errors: Show field-level validation messages
- API errors: Display user-friendly error messages
- Network errors: Show retry options
- Unauthorized access: Redirect to login
