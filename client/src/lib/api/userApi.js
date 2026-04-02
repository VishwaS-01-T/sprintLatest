import { apiRequest } from "../apiClient";

export const userApi = {
  // Get current user profile
  getProfile: () => apiRequest("/user/auth/me", { auth: true }),

  // Update profile
  updateProfile: (payload) =>
    apiRequest("/user/auth/me", {
      method: "PUT",
      body: payload,
      auth: true,
    }),

  // Change password
  changePassword: (payload) =>
    apiRequest("/user/auth/change-password", {
      method: "POST",
      body: payload,
      auth: true,
    }),
};
