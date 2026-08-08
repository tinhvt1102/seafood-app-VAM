/**
 * Users API service - handles user management API requests
 * Endpoints: GET /Users, PUT /Users/customer-status/{userId}
 */
import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const usersApi = {
  /**
   * Lấy danh sách người dùng hệ thống (Admin)
   * @param {Object} filter - { pageNumber, pageSize, search }
   */
  getAllUsers: (filter = {}) => {
    const params = new URLSearchParams();
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
    if (filter.pageSize) params.append('pageSize', filter.pageSize);
    if (filter.search) params.append('search', filter.search);
    const query = params.toString();
    return apiClient.get(`${ENDPOINTS.USERS.LIST}${query ? `?${query}` : ''}`);
  },

  /**
   * Bật/Tắt trạng thái hoạt động của người dùng
   * @param {number|string} userId 
   */
  updateCustomerStatus: (userId) => {
    return apiClient.put(ENDPOINTS.USERS.TOGGLE_STATUS(userId));
  },
};
