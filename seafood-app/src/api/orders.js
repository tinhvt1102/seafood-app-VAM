/**
 * Orders API service - handles order-related API requests
 * Endpoints: GET /orders (Admin), GET /orders/{id}, GET /orders/my-orders, GET /orders/seller-orders, PUT /orders/{id}/status, DELETE /orders/{id}
 */
import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const ordersApi = {
  /**
   * Lấy tất cả đơn hàng hệ thống (Admin only)
   * @param {Object} filter - { pageNumber, pageSize, search }
   */
  getAllOrders: (filter = {}) => {
    const params = new URLSearchParams();
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
    if (filter.pageSize) params.append('pageSize', filter.pageSize);
    if (filter.search) params.append('search', filter.search);
    const query = params.toString();
    return apiClient.get(`${ENDPOINTS.ORDERS.LIST}${query ? `?${query}` : ''}`);
  },

  /**
   * Lấy chi tiết đơn hàng theo ID
   * @param {number|string} id
   */
  getOrderById: (id) => {
    return apiClient.get(ENDPOINTS.ORDERS.DETAIL(id));
  },

  /**
   * Lấy danh sách đơn hàng của người mua hiện tại
   * @param {Object} params - { pageNumber, pageSize }
   */
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('pageNumber', params.pageNumber);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    const queryStr = query.toString();
    return apiClient.get(`${ENDPOINTS.ORDERS.MY_ORDERS}${queryStr ? `?${queryStr}` : ''}`);
  },

  /**
   * Lấy danh sách đơn hàng chứa sản phẩm của người bán
   * @param {Object} params - { pageNumber, pageSize }
   */
  getSellerOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('pageNumber', params.pageNumber);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    const queryStr = query.toString();
    return apiClient.get(`${ENDPOINTS.ORDERS.SELLER_ORDERS}${queryStr ? `?${queryStr}` : ''}`);
  },

  /**
   * Cập nhật trạng thái đơn hàng (State machine)
   * @param {number|string} id
   * @param {string} status - 'confirmed', 'shipping', 'completed', 'cancelled'
   */
  updateOrderStatus: (id, status) => {
    return apiClient.put(ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
  },

  /**
   * Xóa đơn hàng (Admin only - soft delete)
   * @param {number|string} id
   */
  deleteOrder: (id) => {
    return apiClient.delete(ENDPOINTS.ORDERS.DETAIL(id));
  },
};
