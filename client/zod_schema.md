# Sprint Shoes — Request Validation Schemas

> Every request body sent to the server is validated with [Zod](https://zod.dev).
> If validation fails, the API returns `400` with field-level error messages.
>
> Use this reference to build your frontend form validations and API calls.

---

## Table of Contents

| # | Module | Schemas |
|---|--------|---------|
| 1 | [Client Auth](#1-client-auth) | 10 |
| 2 | [Admin Auth](#2-admin-auth) | 2 |
| 3 | [Products (Admin)](#3-products--admin) | 8 |
| 4 | [Inventory (Admin)](#4-inventory--admin) | 1 |
| 5 | [Cart](#5-cart) | 2 |
| 6 | [Wishlist](#6-wishlist) | 1 |
| 7 | [Orders](#7-orders) | 2 |
| 8 | [Shipping (Admin)](#8-shipping--admin) | 4 |
| 9 | [Payments](#9-payments) | 2 |
| 10 | [Coupons](#10-coupons) | 3 |
| 11 | [Returns](#11-returns) | 2 |
| 12 | [Refunds (Admin)](#12-refunds--admin) | 2 |
| 13 | [Reviews](#13-reviews) | 1 |
| 14 | [User Management (Admin)](#14-user-management--admin) | 1 |
| 15 | [Admin Management](#15-admin-management) | 3 |

---

## 1. Client Auth

**File:** `src/controllers/user.controller.ts`

### `phoneSchema`

Used by: `POST /api/user/auth/register/initiate-phone`, `POST /api/user/auth/login/request-otp`

```ts
{
  phoneNumber: string  // regex: /^\+?[1-9]\d{1,14}$/ — E.164 format
}
```

### `verifyPhoneSchema`

Used by: `POST /api/user/auth/register/verify-phone`, `POST /api/user/auth/login/phone`

```ts
{
  phoneNumber: string
  otp: string           // exactly 6 characters
}
```

### `initiateEmailSchema`

Used by: `POST /api/user/auth/register/initiate-email`

```ts
{
  email: string         // valid email
  firstName: string     // min 1 char
}
```

### `verifyEmailTokenSchema`

Used by: `GET /api/user/auth/register/verify-email?token=xxx`

```ts
{
  token: string         // min 1 char (passed as query param)
}
```

### `completeRegistrationSchema`

Used by: `POST /api/user/auth/register/complete`

```ts
{
  sessionId: string
  firstName: string     // min 2 chars
  lastName: string      // min 2 chars
  username: string      // min 3 chars
  email: string         // valid email
  password: string      // min 8 chars
}
```

### `loginWithEmailSchema`

Used by: `POST /api/user/auth/login`

```ts
{
  email: string         // valid email
  password: string      // min 1 char
}
```

### `refreshTokenSchema`

Used by: `POST /api/user/auth/refresh`, `POST /api/user/auth/logout`

```ts
{
  refreshToken: string
}
```

### `forgotPasswordSchema`

Used by: `POST /api/user/auth/forgot-password`

```ts
{
  email: string         // valid email
}
```

### `resetPasswordSchema`

Used by: `POST /api/user/auth/reset-password`

```ts
{
  token: string
  newPassword: string   // min 8 chars
}
```

### `updateProfileSchema`

Used by: `PUT /api/user/auth/me`

```ts
{
  firstName?: string      // min 2 chars
  lastName?: string       // min 2 chars
  username?: string       // min 3 chars
  phoneNumber?: string    // regex: /^\+?[1-9]\d{1,14}$/
}
```

---

## 2. Admin Auth

**File:** `src/controllers/admin.controller.ts`

### `loginSchema`

Used by: `POST /api/admin/auth/login`

```ts
{
  email: string         // valid email
  password: string      // min 1 char
}
```

### `refreshTokenSchema`

Used by: `POST /api/admin/auth/refresh`, `POST /api/admin/auth/logout`

```ts
{
  refreshToken: string
}
```

---

## 3. Products — Admin

**File:** `src/controllers/product.controller.ts`

### `createProductSchema`

Used by: `POST /api/admin/products`

```ts
{
  name: string                          // min 1 char
  brand: string                         // min 1 char
  description?: string
  shortDescription?: string
  gender: "MEN" | "WOMEN" | "UNISEX" | "KIDS"
  shoeType: string                      // min 1 char
  category: string                      // min 1 char
  basePrice: number                     // positive
  releaseDate?: string
  featuredProduct?: boolean
  newArrival?: boolean
}
```

### `updateProductSchema`

Used by: `PUT /api/admin/products/:productId`

> Same as `createProductSchema` with **all fields optional** (`.partial()`)

### `statusSchema`

Used by: `PATCH /api/admin/products/:productId/status`

```ts
{
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "DISCONTINUED"
}
```

### `createVariantSchema`

Used by: `POST /api/admin/products/:productId/variants`

```ts
{
  sku: string                // min 1 char
  size: string               // min 1 char
  color: string              // min 1 char
  material?: string
  width?: string
  price: number              // positive
  comparePrice?: number      // positive
  weight?: number            // positive
  barcode?: string
}
```

### `updateVariantSchema`

Used by: `PUT /api/admin/products/:productId/variants/:variantId`

> Same as `createVariantSchema` with **all fields optional** (`.partial()`)

### `createImageSchema`

Used by: `POST /api/admin/products/:productId/images`

```ts
{
  images: [                  // min 1 item
    {
      imageUrl: string       // valid URL
      altText?: string
      position?: number      // integer
      isThumbnail?: boolean
      variantId?: string     // UUID
    }
  ]
}
```

### `specificationSchema`

Used by: `PUT /api/admin/products/:productId/specification`

```ts
{
  material?: string
  soleMaterial?: string
  upperMaterial?: string
  cushioningType?: string
  heelHeight?: number
  closureType?: string
  waterproof?: boolean
  breathable?: boolean
  weight?: number
}
```

### `sizeGuideSchema`

Used by: `POST /api/admin/products/:productId/size-guides`

```ts
{
  sizeSystem: "US" | "EU" | "UK"
  sizeValue: string          // min 1 char
  footLength?: number        // positive
}
```

---

## 4. Inventory — Admin

**File:** `src/controllers/inventory.controller.ts`

### `updateInventorySchema`

Used by: `PUT /api/admin/inventory/:variantId`

```ts
{
  stockQuantity?: number       // integer, min 0
  reorderThreshold?: number    // integer, min 0
}
```

---

## 5. Cart

**File:** `src/controllers/cart.controller.ts`

### `addItemSchema`

Used by: `POST /api/cart/items`

```ts
{
  variantId: string      // UUID
  size: string           // min 1 char
  color: string          // min 1 char
  quantity: number       // integer, min 1
}
```

### `updateQuantitySchema`

Used by: `PUT /api/cart/items/:itemId`

```ts
{
  quantity: number       // integer, min 1
}
```

---

## 6. Wishlist

**File:** `src/controllers/wishlist.controller.ts`

### `addItemSchema`

Used by: `POST /api/wishlist/items`

```ts
{
  productId: string      // UUID
  variantId?: string     // UUID
}
```

---

## 7. Orders

**File:** `src/controllers/order.controller.ts`

### `checkoutSchema`

Used by: `POST /api/orders/checkout`

```ts
{
  cartId: string                // UUID
  addressId: string             // UUID
  couponCode?: string
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET" | "UPI" | "COD"
  shippingMethod: string        // min 1 char
}
```

### `statusSchema` (Admin)

Used by: `PATCH /api/admin/orders/:orderId/status`

```ts
{
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED"
}
```

---

## 8. Shipping — Admin

**File:** `src/controllers/shipping.controller.ts`

### `createMethodSchema`

Used by: `POST /api/admin/shipping/methods`

```ts
{
  name: string                    // min 1 char
  description?: string
  cost: number                    // min 0
  estimatedDeliveryDays: number   // integer, min 1
}
```

### `updateMethodSchema`

Used by: `PUT /api/admin/shipping/methods/:methodId`

> Same as `createMethodSchema` with **all fields optional** (`.partial()`)

### `createShipmentSchema`

Used by: `POST /api/admin/shipping/shipments`

```ts
{
  courierName: string        // min 1 char
  trackingNumber?: string
  shippingMethod: string     // min 1 char
}
```

### `shipmentStatusSchema`

Used by: `PATCH /api/admin/shipping/shipments/:shipmentId`

```ts
{
  status: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED" | "RETURNED"
}
```

---

## 9. Payments

**File:** `src/controllers/payment.controller.ts`

### `createPaymentSchema`

Used by: `POST /api/payments`

```ts
{
  paymentId: string      // UUID
}
```

### `webhookSchema`

Used by: `POST /api/payments/webhook` (server-to-server, not client-facing)

```ts
{
  transactionId: string   // min 1 char
  paymentId: string       // UUID
  status: "success" | "failed"
}
```

---

## 10. Coupons

**File:** `src/controllers/coupon.controller.ts`

### `createCouponSchema` (Admin)

Used by: `POST /api/admin/coupons`

```ts
{
  code: string                    // 1–50 chars
  description?: string
  discountType: "PERCENTAGE" | "FIXED_AMOUNT"
  discountValue: number           // positive
  minimumOrderValue?: number      // positive
  maximumDiscount?: number        // positive
  usageLimit?: number             // positive integer
  startDate: string               // date string
  expiryDate: string              // date string
}
```

### `updateCouponSchema` (Admin)

Used by: `PUT /api/admin/coupons/:couponId`

> Same as `createCouponSchema` with **all fields optional** plus:
>
> ```ts
> {
>   status?: "ACTIVE" | "INACTIVE" | "EXPIRED"
> }
> ```

### `validateCouponSchema` (Client)

Used by: `POST /api/coupons/validate`

```ts
{
  code: string           // min 1 char
  orderTotal: number     // positive
}
```

---

## 11. Returns

**File:** `src/controllers/return.controller.ts`

### `createReturnSchema` (Client)

Used by: `POST /api/returns`

```ts
{
  reason: string              // min 1 char
  items: [                    // min 1 item
    {
      orderItemId: string     // UUID
      quantity: number        // integer, min 1
    }
  ]
}
```

### `statusSchema` (Admin)

Used by: `PATCH /api/admin/returns/:returnId`

```ts
{
  status: "PENDING" | "APPROVED" | "REJECTED" | "RECEIVED" | "REFUNDED"
}
```

---

## 12. Refunds — Admin

**File:** `src/controllers/refund.controller.ts`

### `createRefundSchema`

Used by: `POST /api/admin/refunds`

```ts
{
  paymentId: string       // UUID
  orderId: string         // UUID
  refundAmount: number    // positive
  refundReason: string    // min 1 char
}
```

### `statusSchema`

Used by: `PATCH /api/admin/refunds/:refundId`

```ts
{
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED"
}
```

---

## 13. Reviews

**File:** `src/controllers/review.controller.ts`

### `createReviewSchema`

Used by: `POST /api/products/:productId/reviews`

```ts
{
  rating: number              // integer, 1–5
  reviewTitle: string         // 1–255 chars
  reviewText?: string
  images?: string[]           // array of valid URLs
}
```

---

## 14. User Management — Admin

**File:** `src/controllers/user-management.controller.ts`

### `statusSchema`

Used by: `PATCH /api/admin/users/:userId/status`

```ts
{
  status: "ACTIVE" | "SUSPENDED" | "DELETED"
}
```

---

## 15. Admin Management

**File:** `src/controllers/admin-management.controller.ts`

### `createAdminSchema`

Used by: `POST /api/admin/admins`

```ts
{
  firstName: string          // min 1 char
  lastName: string           // min 1 char
  email: string              // valid email
  password: string           // min 8 chars
  roleId: string             // UUID
  profileImage?: string      // valid URL
}
```

### `updateAdminSchema`

Used by: `PUT /api/admin/admins/:adminId`

```ts
{
  firstName?: string         // min 1 char
  lastName?: string          // min 1 char
  email?: string             // valid email
  roleId?: string            // UUID
  profileImage?: string      // valid URL
}
```

### `statusSchema`

Used by: `PATCH /api/admin/admins/:adminId/status`

```ts
{
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
}
```

---

## Quick Reference — Enum Values

| Enum | Values |
|------|--------|
| Gender | `MEN`, `WOMEN`, `UNISEX`, `KIDS` |
| Product Status | `DRAFT`, `ACTIVE`, `ARCHIVED`, `DISCONTINUED` |
| Order Status | `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED` |
| Payment Method | `CREDIT_CARD`, `DEBIT_CARD`, `NET_BANKING`, `WALLET`, `UPI`, `COD` |
| Shipment Status | `PENDING`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED`, `RETURNED` |
| Coupon Type | `PERCENTAGE`, `FIXED_AMOUNT` |
| Coupon Status | `ACTIVE`, `INACTIVE`, `EXPIRED` |
| Return Status | `PENDING`, `APPROVED`, `REJECTED`, `RECEIVED`, `REFUNDED` |
| Refund Status | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELLED` |
| User Status | `ACTIVE`, `SUSPENDED`, `DELETED` |
| Admin Status | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| Size System | `US`, `EU`, `UK` |
| Webhook Status | `success`, `failed` |

---

## Validation Error Response

When a request fails validation, the server returns:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    },
    {
      "path": ["password"],
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**HTTP Status:** `400 Bad Request`
