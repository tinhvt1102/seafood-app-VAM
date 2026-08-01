import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const authApi = {
  /**
   * Log in user with email and password
   */
  login: async (email, password) => {
    return await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  /**
   * Log in with Google token
   */
  googleLogin: async (idToken) => {
    return await apiClient.post(ENDPOINTS.AUTH.GOOGLE_LOGIN, { idToken });
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    return await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
  },

  /**
   * Request forgot password link/code
   */
  forgotPassword: async (email) => {
    return await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    return await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
  },

  /**
   * Change password (requires auth token)
   */
  changePassword: async (oldPassword, newPassword) => {
    return await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { oldPassword, newPassword });
  },

  /**
   * Log out user (requires auth token)
   */
  logout: async () => {
    return await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Update pending user to active customer
   */
  updateCustomerStatus: async (userId) => {
    return await apiClient.put(`/Users/customer-status/${userId}`);
  },

  /**
   * Create seller profile (Form Data with PDF certificate)
   */
  createSellerProfile: async (formData) => {
    return await apiClient.post('/Profiles/seller', formData);
  },

  /**
   * Create business profile (Form Data with PDF business license)
   */
  createBusinessProfile: async (formData) => {
    return await apiClient.post('/Profiles/business', formData);
  },

  /**
   * Get user detail by ID
   */
  getUserById: async (id) => {
    return await apiClient.get(`/Users/${id}`);
  },

  /**
   * Get current user's seller profile details
   */
  getMySellerProfile: async () => {
    return await apiClient.get('/Profiles/seller/me');
  },

  /**
   * Get current user's business profile details
   */
  getMyBusinessProfile: async () => {
    return await apiClient.get('/Profiles/business/me');
  },

  /**
   * Get list of approved seller profiles (trang trại hải sản) cho trang Tìm nguồn hải sản
   */
  getApprovedSellers: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('pageNumber', params.pageNumber);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    if (params.search) query.append('search', params.search);
    const queryStr = query.toString();
    return await apiClient.get(`${ENDPOINTS.PROFILES.APPROVED_SELLERS}${queryStr ? `?${queryStr}` : ''}`);
  },

  /**
   * Get detail of a specific seller profile including their active products
   */
  getSellerDetail: async (id) => {
    return await apiClient.get(ENDPOINTS.PROFILES.SELLER_DETAIL(id));
  }
};
