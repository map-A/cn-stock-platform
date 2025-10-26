# Authentication & Authorization

## Overview
Manages user authentication, registration, password management, and access control throughout the platform.

## API Endpoints

### 1. User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "John Doe",
  "phone": "+86 10 1234 5678",
  "referralCode": "OPTIONAL"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Registration successful",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2024-10-26T00:00:00Z"
  }
}
```

**Validation Rules:**
- Email must be unique and valid
- Password minimum 8 characters, must contain uppercase, lowercase, number
- Phone must be valid Chinese format
- Referral code (if provided) must be valid

---

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600,
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    }
  }
}
```

**Error Codes:**
- `401`: Invalid credentials
- `429`: Too many login attempts

---

### 3. Token Refresh
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### 4. User Logout
**POST** `/auth/logout`

**Request Body:**
```json
{
  "token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Logout successful"
}
```

---

### 5. Password Reset - Request
**POST** `/auth/password-reset-request`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Reset link sent to email"
}
```

**Logic:**
- Generate 6-digit OTP or reset token
- Send via email with 24-hour expiration
- Implement rate limiting (max 3 requests per hour)

---

### 6. Password Reset - Confirm
**POST** `/auth/password-reset`

**Request Body:**
```json
{
  "email": "user@example.com",
  "resetToken": "token123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Password reset successful"
}
```

---

### 7. Change Password
**POST** `/auth/change-password`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Password changed successfully"
}
```

---

### 8. Verify Email
**POST** `/auth/verify-email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Email verified successfully",
  "data": {
    "emailVerified": true
  }
}
```

---

### 9. Send Email Verification
**POST** `/auth/send-verification-email`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Verification email sent"
}
```

---

## Security Requirements

### Password Policy
- Minimum 8 characters
- Must contain: uppercase letter, lowercase letter, number, special character
- Cannot reuse last 5 passwords
- Expiration period: 90 days

### Session Management
- Token expiration: 1 hour
- Refresh token expiration: 30 days
- Concurrent session limit: 3 devices
- Auto-logout on inactivity: 30 minutes

### Rate Limiting
- Login attempts: 5 per 15 minutes per IP
- Password reset: 3 per hour per email
- Verification code: 3 per hour per email

### Two-Factor Authentication (2FA)
- Optional but recommended
- Methods: SMS, Email, Authenticator app
- Endpoints needed:
  - POST `/auth/2fa/enable`
  - POST `/auth/2fa/verify`
  - POST `/auth/2fa/disable`
  - POST `/auth/2fa/backup-codes`

---

## Authorization Levels

### User Roles
1. **Guest** - No authentication, limited data access
2. **User** - Standard user with basic features
3. **Premium** - Premium features: advanced analytics, strategies
4. **Analyst** - Can publish analysis and research
5. **Admin** - Full system access
6. **SuperAdmin** - System administration and support

### Permission Model
- Role-based access control (RBAC)
- Resource-level permissions
- Time-based access (trial features)
- Subscription-based features

### Feature Access by Role
| Feature | Guest | User | Premium | Analyst | Admin |
|---------|-------|------|---------|---------|-------|
| View stocks | ✓ | ✓ | ✓ | ✓ | ✓ |
| Watchlist | ✗ | ✓ | ✓ | ✓ | ✓ |
| Strategies | ✗ | ✓ | ✓ | ✓ | ✓ |
| Backtesting | ✗ | Limited | ✓ | ✓ | ✓ |
| Analytics | ✗ | Basic | Advanced | ✓ | ✓ |
| Risk Mgmt | ✗ | Basic | ✓ | ✓ | ✓ |
| Admin Panel | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Token Structure (JWT)

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user",
  "permissions": ["view:stocks", "create:watchlist"],
  "subscriptionLevel": "premium",
  "iat": 1635254400,
  "exp": 1635258000
}
```

---

## Error Handling

**Common Error Codes:**
- `400`: Invalid request data
- `401`: Unauthorized / Invalid token
- `403`: Forbidden / Insufficient permissions
- `404`: Resource not found
- `422`: Validation failed
- `429`: Rate limit exceeded
- `500`: Server error

---

## Implementation Notes

1. **Token Storage:** Store tokens in secure, HTTP-only cookies (not localStorage)
2. **CORS:** Enable CORS for authenticated endpoints
3. **HTTPS:** All auth endpoints must use HTTPS
4. **Logging:** Log all authentication attempts and failures
5. **Auditing:** Maintain audit log of permission changes
6. **MFA:** Implement challenge-response for MFA
