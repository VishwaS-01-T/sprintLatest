import { dummyProducts } from '@/lib/constants/dummyProducts'

const MOCK_ADMIN = {
  id: 'mock-admin-1',
  firstName: 'Demo',
  lastName: 'Admin',
  email: 'admin1@shoesprint.com',
  role: {
    roleName: 'Super Admin',
    permissions: ['*'],
  },
}

const toImageObjects = (images = []) =>
  images.map((imageUrl, index) => ({
    id: `img-${index + 1}`,
    imageUrl,
    altText: `Product image ${index + 1}`,
    position: index,
    isThumbnail: index === 0,
  }))

const toVariantObjects = (variants = [], basePrice = 0) =>
  variants.map((variant, index) => ({
    id: `var-${index + 1}`,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    material: variant.material,
    width: variant.width,
    price: variant.price ?? basePrice,
    inventory: {
      availableStock: 12 - index,
    },
  }))

const productCatalog = dummyProducts.map((item, index) => ({
  id: `mock-product-${index + 1}`,
  slug: `mock-product-${index + 1}`,
  name: item.name,
  brand: item.brand,
  description: item.description,
  shortDescription: item.shortDescription,
  gender: item.gender,
  shoeType: item.shoeType,
  category: item.category,
  basePrice: item.basePrice,
  featuredProduct: item.featuredProduct,
  newArrival: item.newArrival,
  status: index % 4 === 0 ? 'DRAFT' : 'ACTIVE',
  createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - index * 3600000).toISOString(),
  releaseDate: new Date(Date.now() - (index + 5) * 86400000).toISOString(),
  images: toImageObjects(item.images),
  variants: toVariantObjects(item.variants, item.basePrice),
}))

const mockOrders = Array.from({ length: 8 }).map((_, index) => {
  const product = productCatalog[index % productCatalog.length]
  const quantity = (index % 3) + 1
  const subtotal = Number((product.basePrice * quantity).toFixed(2))
  const taxAmount = Number((subtotal * 0.08).toFixed(2))
  const shippingCost = index % 2 === 0 ? 0 : 9.99
  const discountAmount = index % 4 === 0 ? 10 : 0
  const totalAmount = Number((subtotal + taxAmount + shippingCost - discountAmount).toFixed(2))
  const date = new Date(Date.now() - (index + 1) * 43200000)

  return {
    id: `mock-order-${index + 1}`,
    orderNumber: `SS-2026-${String(1000 + index)}`,
    placedAt: date.toISOString(),
    orderStatus: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'][index % 4],
    paymentStatus: index % 2 === 0 ? 'PAID' : 'PENDING',
    fulfillmentStatus: ['PENDING', 'PACKED', 'SHIPPED', 'DELIVERED'][index % 4],
    subtotal,
    taxAmount,
    shippingCost,
    discountAmount,
    totalAmount,
    customer: {
      id: `mock-customer-${index + 1}`,
      firstName: ['Liam', 'Emma', 'Noah', 'Ava'][index % 4],
      lastName: ['Smith', 'Johnson', 'Brown', 'Davis'][index % 4],
      email: `customer${index + 1}@example.com`,
    },
    items: [
      {
        id: `mock-item-${index + 1}`,
        productNameSnapshot: product.name,
        size: product.variants[0]?.size || '9',
        color: product.variants[0]?.color || 'Black',
        quantity,
        total: subtotal,
      },
    ],
    addresses: {
      shippingAddress: JSON.stringify({
        fullName: 'Test Customer',
        phone: '+1 555-0100',
        addressLine1: '123 Demo Street',
        addressLine2: 'Apt 7B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
      }),
    },
  }
})

const toSalesBreakdown = () =>
  Array.from({ length: 14 }).map((_, index) => ({
    date: new Date(Date.now() - (13 - index) * 86400000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    total: 2200 + index * 185,
  }))

export const mockData = {
  admin: MOCK_ADMIN,
  auth: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  },
  products: productCatalog,
  orders: mockOrders,
}

export const isMockMode =
  String(import.meta.env.VITE_ENABLE_MOCK || '').toLowerCase() === 'true'

export const isNetworkError = (error) => !error?.response

export const getMockProducts = (params = {}) => {
  const search = String(params.search || '').toLowerCase()
  const status = params.status || ''

  let filtered = [...mockData.products]

  if (status) {
    filtered = filtered.filter((item) => item.status === status)
  }

  if (search) {
    filtered = filtered.filter((item) =>
      [item.name, item.brand, item.category, item.shoeType].join(' ').toLowerCase().includes(search),
    )
  }

  return {
    products: filtered,
    pagination: {
      page: Number(params.page || 1),
      limit: Number(params.limit || 20),
      total: filtered.length,
      totalPages: 1,
    },
  }
}

export const getMockProductById = (productId) =>
  mockData.products.find((item) => item.id === productId || item.slug === productId) || null

export const getMockOrders = (params = {}) => {
  const search = String(params.search || '').toLowerCase()
  const status = params.status || ''

  let filtered = [...mockData.orders]

  if (status) {
    filtered = filtered.filter((item) => item.orderStatus === status)
  }

  if (search) {
    filtered = filtered.filter((item) =>
      [item.orderNumber, item.customer?.firstName, item.customer?.lastName, item.customer?.email]
        .join(' ')
        .toLowerCase()
        .includes(search),
    )
  }

  return {
    orders: filtered,
    pagination: {
      page: Number(params.page || 1),
      limit: Number(params.limit || 20),
      total: filtered.length,
      totalPages: 1,
    },
  }
}

export const getMockOrderById = (orderId) =>
  mockData.orders.find((item) => item.id === orderId) || null

export const getMockOrderTimeline = (orderId) => {
  const order = getMockOrderById(orderId)
  if (!order) return { timeline: [] }

  return {
    timeline: [
      { event: 'ORDER_PLACED', at: order.placedAt },
      { event: 'PAYMENT_CONFIRMED', at: new Date(new Date(order.placedAt).getTime() + 3600000).toISOString() },
      { event: 'PROCESSING_STARTED', at: new Date(new Date(order.placedAt).getTime() + 7200000).toISOString() },
    ],
  }
}

export const getMockDashboard = () => {
  const totalSales = mockData.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)

  return {
    salesToday: totalSales,
    ordersToday: mockData.orders.length,
    totalUsers: 1284,
    totalProducts: mockData.products.length,
    topProducts: mockData.products.slice(0, 5).map((product, index) => ({
      product: { id: product.id, name: product.name },
      totalQuantity: 25 - index * 3,
      totalRevenue: Number((product.basePrice * (25 - index * 3)).toFixed(2)),
    })),
    lowInventory: mockData.products.slice(0, 5).map((product, index) => ({
      variantId: product.variants[0]?.id || `variant-${index + 1}`,
      sku: product.variants[0]?.sku || `SKU-${index + 1}`,
      availableStock: index,
      productName: product.name,
    })),
  }
}

export const getMockSales = () => ({
  dailyBreakdown: toSalesBreakdown(),
})

export const getMockInventoryAlerts = (limit = 10) => ({
  lowStock: getMockDashboard().lowInventory.slice(0, limit),
})
