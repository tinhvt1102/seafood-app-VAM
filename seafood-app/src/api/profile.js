import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

/**
 * Profile API service for managing Seller and Business profiles
 */
export const profileApi = {
  /**
   * User Profile functions
   */
  createSellerProfile: async (formData) => {
    return await apiClient.post(ENDPOINTS.PROFILES.CREATE_SELLER, formData);
  },

  createBusinessProfile: async (formData) => {
    return await apiClient.post(ENDPOINTS.PROFILES.CREATE_BUSINESS, formData);
  },

  getMySellerProfile: async () => {
    return await apiClient.get(ENDPOINTS.PROFILES.MY_SELLER);
  },

  getMyBusinessProfile: async () => {
    return await apiClient.get(ENDPOINTS.PROFILES.MY_BUSINESS);
  },

  /**
   * Admin Profile Approval functions
   */
  getPendingSellerProfiles: async (page = 1, pageSize = 10) => {
    return await apiClient.get(`${ENDPOINTS.ADMIN_PROFILES.PENDING_SELLERS}?page=${page}&pageSize=${pageSize}`);
  },

  getPendingBusinessProfiles: async (page = 1, pageSize = 10) => {
    return await apiClient.get(`${ENDPOINTS.ADMIN_PROFILES.PENDING_BUSINESSES}?page=${page}&pageSize=${pageSize}`);
  },

  approveSellerProfile: async (id, isApproved) => {
    return await apiClient.put(ENDPOINTS.ADMIN_PROFILES.APPROVE_SELLER(id), { isApproved: Boolean(isApproved) });
  },

  approveBusinessProfile: async (id, isApproved) => {
    return await apiClient.put(ENDPOINTS.ADMIN_PROFILES.APPROVE_BUSINESS(id), { isApproved: Boolean(isApproved) });
  },
};
