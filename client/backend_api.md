# Sprint Shoes — API Integration Guide

> **Base URL:** `http://localhost:3000/api`
> **Content-Type:** `application/json`
> **Authentication:** Bearer JWT in `Authorization` header

All responses follow the shape:
```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error description" }
```

---

## Table of Contents

1. [Authentication — Client](#1-authentication--client)
2. [Authentication — Admin](#2-authentication--admin)
3. [Products — Public](#3-products--public)
4. [Products — Admin](#4-products--admin)
5. [Inventory — Admin](#5-inventory--admin)
6. [Cart](#6-cart)
7. [Wishlist](#7-wishlist)
8. [Orders — Client](#8-orders--client)
9. [Orders — Admin](#9-orders--admin)
10. [Payments](#10-payments)
11. [Shipping — Admin](#11-shipping--admin)
12. [Coupons — Client](#12-coupons--client)
13. [Coupons — Admin](#13-coupons--admin)
14. [Returns — Client](#14-returns--client)
15. [Returns — Admin](#15-returns--admin)
16. [Refunds — Admin](#16-refunds--admin)
17. [Reviews](#17-reviews)
18. [User Management — Admin](#18-user-management--admin)
19. [Admin Management](#19-admin-management)
20. [Activity Logs — Admin](#20-activity-logs--admin)
21. [Analytics — Admin](#21-analytics--admin)

---

## 1. Authentication — Client

Base: `/api/user/auth`

### Registration Flow

| Step | Method | Endpoint | Body | Auth |
|------|--------|----------|------|------|
| 1 | POST | `/register/initiate-phone` | `{ phone }` | No |
| 2 | POST | `/register/verify-phone` | `{ phone, otp }` | No |
| 3 | POST | `/register/initiate-email` | `{ phone, email }` | No |
| 4 | GET | `/register/verify-email?token=xxx` | — | No |
| 5 | POST | `/register/complete` | `{ phone, email, password, firstName, lastName }` | No |

Resend helpers:
- `POST /register/resend-phone-otp` → `{ phone }`
- `POST /register/resend-email` → `{ phone, email }`

### Login

| Method | Endpoint | Body | Notes |
|--------|----------|------|-------|
| POST | `/login` | `{ email, password }` | Email + password login |
| POST | `/login/request-otp` | `{ phone }` | Request phone OTP |
| POST | `/login/resend-otp` | `{ phone }` | Resend phone OTP |
| POST | `/login/phone` | `{ phone, otp }` | Login via phone OTP |

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "a1b2c3d4..."
  }
}
```

### Session Management (Auth Required)

| Method | Endpoint | Body | Notes |
|--------|----------|------|-------|
| POST | `/logout` | `{ refreshToken }` | Logout current session |
| POST | `/logout/all` | — | Logout all sessions 🔒 |
| POST | `/refresh` | `{ refreshToken }` | Rotate tokens |
| GET | `/sessions` | — | List active sessions 🔒 |
| DELETE | `/sessions/:sessionId` | — | Revoke specific session 🔒 |

### Password Reset

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/forgot-password` | `{ email }` |
| GET | `/reset-password/validate?token=xxx` | — |
| POST | `/reset-password` | `{ token, password }` |

### Profile (Auth Required 🔒)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/me` | — |
| PUT | `/me` | `{ firstName?, lastName?, phone? }` |

---

## 2. Authentication — Admin

Base: `/api/admin/auth`

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/login` | `{ email, password }` | No |
| POST | `/logout` | `{ refreshToken }` | No |
| POST | `/logout/all` | — | 🔒 Admin |
| POST | `/refresh` | `{ refreshToken }` | No |
| GET | `/me` | — | 🔒 Admin |
| GET | `/sessions` | — | 🔒 Admin |
| GET | `/activity-logs` | — | 🔒 Admin |
| DELETE | `/sessions/:sessionId` | — | 🔒 Admin |

---

## 3. Products — Public

Base: `/api/products`

| Method | Endpoint | Query Params | Notes |
|--------|----------|-------------|-------|
| GET | `/` | `page, limit, category, brand, minPrice, maxPrice, gender, sortBy, sortOrder` | Browse with filters |
| GET | `/featured` | `limit` | Featured products |
| GET | `/new-arrivals` | `limit` | New arrivals |
| GET | `/search` | `q, page, limit` | Full-text search |
| GET | `/:slug` | — | Product detail by slug |

### Reviews (nested under products)

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| GET | `/:productId/reviews` | Query: `page, limit` | No |
| POST | `/:productId/reviews` | `{ rating, title?, comment? }` | 🔒 User |

---

## 4. Products — Admin

Base: `/api/admin/products` (🔒 Admin Auth)

### Product CRUD

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/` | `{ name, description, brand, category, gender, basePrice, tags? }` |
| GET | `/` | Query: `page, limit, status, search` |
| GET | `/:productId` | — |
| PUT | `/:productId` | `{ name?, description?, brand?, category?, gender?, basePrice?, isFeatured? }` |
| DELETE | `/:productId` | — (soft-archives) |
| PATCH | `/:productId/status` | `{ status }` — `DRAFT`, `ACTIVE`, `ARCHIVED` |

### Variants

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/:productId/variants` | `{ sku, size, color, price, weight? }` |
| PUT | `/:productId/variants/:variantId` | `{ sku?, size?, color?, price?, weight?, isActive? }` |
| DELETE | `/:productId/variants/:variantId` | — |

### Images

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/:productId/images` | `{ images: [{ url, altText?, isPrimary?, sortOrder? }] }` |
| DELETE | `/:productId/images/:imageId` | — |

### Specification

| Method | Endpoint | Body |
|--------|----------|------|
| PUT | `/:productId/specification` | `{ material?, soleMaterial?, closure?, heelHeight?, … }` |

### Size Guides

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/:productId/size-guides` | `{ region, sizeLabel, footLengthCm, footWidthCm? }` |
| DELETE | `/:productId/size-guides/:guideId` | — |

---

## 5. Inventory — Admin

Base: `/api/admin/inventory` (🔒 Admin Auth)

| Method | Endpoint | Body / Query |
|--------|----------|-------------|
| GET | `/` | Query: `page, limit, lowStock` |
| GET | `/:variantId` | — |
| PUT | `/:variantId` | `{ totalStock?, reservedStock?, reorderPoint?, reorderQty? }` |

---

## 6. Cart

Base: `/api/cart` (🔒 User Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/` | — |
| POST | `/items` | `{ productId, variantId, quantity }` |
| PUT | `/items/:itemId` | `{ quantity }` |
| DELETE | `/items/:itemId` | — |
| DELETE | `/` | — (clears entire cart) |

**GET /cart Response:**
```json
{
  "success": true,
  "data": {
    "cart": { "id": "...", "items": [...] },
    "summary": {
      "subtotal": 4999.00,
      "tax": 899.82,
      "shipping": 0,
      "total": 5898.82,
      "itemCount": 2
    }
  }
}
```

---

## 7. Wishlist

Base: `/api/wishlist` (🔒 User Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/` | — |
| POST | `/items` | `{ productId, variantId? }` |
| DELETE | `/items/:itemId` | — |
| POST | `/items/:itemId/move-to-cart` | `{ quantity? }` |

---

## 8. Orders — Client

Base: `/api/orders` (🔒 User Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/checkout` | `{ shippingMethodId, addressId, couponCode? }` |
| GET | `/` | Query: `page, limit, status` |
| GET | `/:orderId` | — |
| POST | `/:orderId/cancel` | — |

**Checkout Flow (internal):**
1. Validates cart is not empty
2. Checks inventory availability for every item
3. Fetches shipping method & calculates shipping cost
4. Computes subtotal + tax (18%)
5. Applies coupon discount (if provided)
6. Snapshots user address → OrderAddress
7. Creates Order + OrderItems + Payment (PENDING)
8. Confirms reserved stock
9. Clears the cart

**Order Statuses:** `PENDING` → `CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED` / `CANCELLED`

---

## 9. Orders — Admin

Base: `/api/admin/orders` (🔒 Admin Auth)

| Method | Endpoint | Body / Query |
|--------|----------|-------------|
| GET | `/` | Query: `page, limit, status, paymentStatus, search` |
| GET | `/:orderId` | — |
| PATCH | `/:orderId/status` | `{ status }` |

**Valid Status Transitions:**
- `PENDING` → `CONFIRMED`, `CANCELLED`
- `CONFIRMED` → `PROCESSING`, `CANCELLED`
- `PROCESSING` → `SHIPPED`, `CANCELLED`
- `SHIPPED` → `DELIVERED`

---

## 10. Payments

Base: `/api/payments`

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/` | `{ orderId }` | 🔒 User |
| POST | `/webhook` | `{ transactionId, status, razorpayPaymentId?, razorpaySignature? }` | None (gateway callback) |
| GET | `/:paymentId` | — | 🔒 User |

**Webhook `status` values:** `success`, `failed`

On successful webhook:
- Payment → `COMPLETED`
- Order paymentStatus → `CONFIRMED`

---

## 11. Shipping — Admin

Base: `/api/admin/shipping` (🔒 Admin Auth)

### Shipping Methods

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/methods` | `{ name, description?, baseRate, estimatedDays, isActive? }` |
| GET | `/methods` | — |
| PUT | `/methods/:methodId` | `{ name?, baseRate?, estimatedDays?, isActive? }` |
| DELETE | `/methods/:methodId` | — |

### Shipments

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/shipments` | `{ orderId, shippingMethodId, trackingNumber, carrier? }` |
| PATCH | `/shipments/:shipmentId` | `{ status }` — `PENDING`, `PICKED_UP`, `IN_TRANSIT`, `DELIVERED`, `RETURNED` |

Creating a shipment automatically updates order status to `SHIPPED`.
Setting shipment to `DELIVERED` automatically updates order to `DELIVERED`.

---

## 12. Coupons — Client

Base: `/api/coupons` (🔒 User Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/validate` | `{ code, orderTotal }` |

**Response:**
```json
{
  "success": true,
  "data": {
    "coupon": { "code": "SAVE20", "discountType": "PERCENTAGE", "discountValue": 20 },
    "discount": 999.80,
    "finalTotal": 3999.20
  }
}
```

---

## 13. Coupons — Admin

Base: `/api/admin/coupons` (🔒 Admin Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/` | `{ code, description?, discountType, discountValue, minOrderAmount?, maxDiscount?, usageLimit?, validFrom, validUntil }` |
| GET | `/` | Query: `page, limit, status` (`ACTIVE`/`INACTIVE`/`EXPIRED`) |
| PUT | `/:couponId` | Same fields as create (all optional) |
| DELETE | `/:couponId` | — |

**discountType:** `PERCENTAGE` or `FIXED`

---

## 14. Returns — Client

Base: `/api/returns` (🔒 User Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/` | `{ orderId, reason, items: [{ orderItemId, quantity }] }` |
| GET | `/` | Query: `page, limit` |

Only `DELIVERED` orders can be returned.

---

## 15. Returns — Admin

Base: `/api/admin/returns` (🔒 Admin Auth)

| Method | Endpoint | Body / Query |
|--------|----------|-------------|
| GET | `/` | Query: `page, limit, status` |
| PATCH | `/:returnId` | `{ status, adminNotes? }` |

**Return Statuses:** `REQUESTED` → `APPROVED` / `REJECTED`, `APPROVED` → `RECEIVED` → `COMPLETED`

On `APPROVED` or `RECEIVED` → inventory is automatically restocked.

---

## 16. Refunds — Admin

Base: `/api/admin/refunds` (🔒 Admin Auth)

| Method | Endpoint | Body / Query |
|--------|----------|-------------|
| POST | `/` | `{ paymentId, amount, reason? }` |
| PATCH | `/:refundId` | `{ status }` (`PROCESSING`, `COMPLETED`, `FAILED`) |
| GET | `/` | Query: `page, limit, status` |

---

## 17. Reviews

### Client — Create (Auth Required)

`POST /api/products/:productId/reviews`
```json
{ "rating": 5, "title": "Great shoes!", "comment": "Very comfortable" }
```
- User must have purchased the product (verified purchase badge)
- User can only review a product once

### Public — List Reviews

`GET /api/products/:productId/reviews?page=1&limit=10`

**Response includes stats:**
```json
{
  "reviews": [...],
  "stats": { "averageRating": 4.5, "totalReviews": 23 }
}
```

### Admin — Delete Review

`DELETE /api/admin/reviews/:reviewId` (🔒 Admin Auth)

---

## 18. User Management — Admin

Base: `/api/admin/users` (🔒 Admin Auth)

| Method | Endpoint | Body / Query |
|--------|----------|-------------|
| GET | `/` | Query: `page, limit, status, search` |
| GET | `/:userId` | — (includes address, order/review counts) |
| PATCH | `/:userId/status` | `{ status }` — `ACTIVE`, `SUSPENDED`, `BANNED` |

---

## 19. Admin Management

Base: `/api/admin/admins` (🔒 Admin Auth)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/` | Query: `page, limit` |
| POST | `/` | `{ email, password, firstName, lastName, roleId }` |
| PUT | `/:adminId` | `{ email?, firstName?, lastName?, roleId? }` |
| PATCH | `/:adminId/status` | `{ isActive }` (cannot toggle own status) |

---

## 20. Activity Logs — Admin

Base: `/api/admin/activity-logs` (🔒 Admin Auth)

`GET /`

| Query Param | Type | Notes |
|-------------|------|-------|
| `page` | number | Default 1 |
| `limit` | number | Default 20 |
| `adminId` | string | Filter by specific admin |
| `entityType` | string | e.g., `ORDER`, `PRODUCT` |
| `action` | string | e.g., `CREATE`, `UPDATE` |

---

## 21. Analytics — Admin

Base: `/api/admin/analytics` (🔒 Admin Auth)

### Dashboard

`GET /dashboard`

Returns:
- `salesToday` — today's revenue
- `ordersToday` — today's order count
- `totalUsers` — active users
- `totalProducts` — active products
- `topProducts` — top 10 by revenue (name, quantity, revenue)
- `lowInventory` — items below reorder point

### Sales Analytics

`GET /sales?startDate=2025-01-01&endDate=2025-01-31`

Returns:
- `totalSales`, `totalOrders`, `averageOrderValue`
- `dailyBreakdown` — array of `{ date, total, count }`

### Product Analytics

`GET /products`

Returns:
- `statusBreakdown` — count per product status
- `topRated` — top 10 by average rating (min 3 reviews)
- `mostOrdered` — top 10 by total quantity sold

---

## Authentication Headers

```
Authorization: Bearer <accessToken>
```

**Token Lifecycle:**
1. Login → receive `accessToken` (15 min) + `refreshToken` (opaque, 7 days)
2. On 401 → call `/auth/refresh` with `refreshToken`
3. Receive new token pair (old refresh token is rotated)

**Admin tokens** contain `{ id, email, roleId, type: "admin" }`
**User tokens** contain `{ id, email, type: "user" }`

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 400 | Validation error (Zod) or business rule violation |
| 401 | Missing or invalid token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limits

| Limiter | Requests | Window | Applied To |
|---------|----------|--------|-----------|
| `authLimiter` | 5 | 15 min | Login endpoints |
| `otpLimiter` | 3 | 15 min | OTP endpoints |
| `passwordResetLimiter` | 3 | 1 hour | Password reset |
| `generalLimiter` | 100 | 15 min | All other endpoints |
