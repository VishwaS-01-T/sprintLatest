import { apiRequest } from "../apiClient";

export const reviewsApi = {
  // Get reviews for a product (public)
  getProductReviews: (productId, { page = 1, limit = 10 } = {}) =>
    apiRequest(`/products/${productId}/reviews?page=${page}&limit=${limit}`),

  // Create review (auth required)
  createReview: (productId, payload) =>
    apiRequest(`/products/${productId}/reviews`, {
      method: "POST",
      body: payload,
      auth: true,
    }),

  // Get my reviews (auth required)
  getMyReviews: ({ page = 1, limit = 20 } = {}) =>
    apiRequest(`/reviews/my-reviews?page=${page}&limit=${limit}`, {
      auth: true,
    }),

  // Update my review (auth required)
  updateReview: (reviewId, payload) =>
    apiRequest(`/reviews/my-reviews/${reviewId}`, {
      method: "PUT",
      body: payload,
      auth: true,
    }),

  // Delete my review (auth required)
  deleteReview: (reviewId) =>
    apiRequest(`/reviews/my-reviews/${reviewId}`, {
      method: "DELETE",
      auth: true,
    }),
};
