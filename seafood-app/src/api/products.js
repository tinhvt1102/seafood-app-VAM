/**
 * Product API service - handles all product-related API calls
 * Endpoints: GET/POST/PUT/DELETE /Products, PUT /Products/{id}/approve
 */
import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const productApi = {
  /**
   * Lấy danh sách sản phẩm có filter & phân trang
   * @param {Object} filter - { pageNumber, pageSize, search, status, categoryId, farmId, minPrice, maxPrice, sellerId }
   */
  getProducts: (filter = {}) => {
    const params = new URLSearchParams();
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
    if (filter.pageSize) params.append('pageSize', filter.pageSize);
    if (filter.search) params.append('search', filter.search);
    if (filter.status) params.append('status', filter.status);
    if (filter.categoryId) params.append('categoryId', filter.categoryId);
    if (filter.farmId) params.append('farmId', filter.farmId);
    if (filter.sellerId) params.append('sellerId', filter.sellerId);
    if (filter.minPrice) params.append('minPrice', filter.minPrice);
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice);
    if (filter.isWholesale !== undefined && filter.isWholesale !== null) params.append('isWholesale', filter.isWholesale);
    const query = params.toString();
    return apiClient.get(`${ENDPOINTS.PRODUCTS.LIST}${query ? `?${query}` : ''}`);
  },

  /**
   * Lấy danh sách sản phẩm của Seller đang đăng nhập
   */
  getMyProducts: (filter = {}) => {
    const params = new URLSearchParams();
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
    if (filter.pageSize) params.append('pageSize', filter.pageSize);
    if (filter.search) params.append('search', filter.search);
    if (filter.status) params.append('status', filter.status);
    const query = params.toString();
    return apiClient.get(`${ENDPOINTS.PRODUCTS.LIST}/my-products${query ? `?${query}` : ''}`);
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  getProductById: (id) => {
    return apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  /**
   * Tạo sản phẩm mới (gửi FormData với ảnh)
   * @param {FormData} formData - chứa Name, CategoryId, FarmId, Price, Quantity, Unit, Description, Images[]
   */
  createProduct: (formData) => {
    return apiClient.post(ENDPOINTS.PRODUCTS.CREATE, formData);
  },

  /**
   * Cập nhật sản phẩm (gửi FormData)
   * @param {number} id 
   * @param {FormData} formData
   */
  updateProduct: (id, formData) => {
    return apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), formData);
  },

  /**
   * Admin duyệt/từ chối sản phẩm
   * @param {number} id
   * @param {Object} dto - { status: "approved"|"rejected", note?: string }
   */
  approveProduct: (id, dto) => {
    return apiClient.put(ENDPOINTS.PRODUCTS.APPROVE(id), dto);
  },

  /**
   * Xóa sản phẩm (soft delete)
   */
  deleteProduct: (id) => {
    return apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  },
};

/**
 * Category API service
 */
export const categoryApi = {
  /**
   * Lấy danh sách danh mục
   */
  getCategories: (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageSize) query.append('pageSize', params.pageSize);
    if (params.pageNumber) query.append('pageNumber', params.pageNumber);
    const queryStr = query.toString();
    return apiClient.get(`${ENDPOINTS.CATEGORIES.LIST}${queryStr ? `?${queryStr}` : ''}`);
  },
};

/**
 * Payment API service (PayOS integration)
 */
export const paymentApi = {
  /**
   * Tạo link thanh toán PayOS VietQR cho đơn hàng
   * @param {number} orderId 
   * @param {number} [amount] - Tổng tiền thanh toán (total) bao gồm phí dịch vụ
   */
  createCheckoutUrl: (orderId, amount) => {
    const endpoint = ENDPOINTS.PAYMENTS.CHECKOUT(orderId);
    if (amount) {
      return apiClient.post(`${endpoint}?amount=${Math.round(amount)}`, { amount: Math.round(amount) });
    }
    return apiClient.post(endpoint);
  },
};

/**
 * Order API service
 */
export const orderApi = {
  /**
   * Tạo đơn hàng mới trong Database
   * @param {Object} dto - { shippingAddress, orderItems: [{ productId, quantity }] }
   */
  createOrder: (dto) => {
    return apiClient.post(ENDPOINTS.ORDERS.CREATE, dto);
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
   * Lấy danh sách đơn hàng cho Seller
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
   * Cập nhật trạng thái đơn hàng (Seller/Buyer)
   * @param {number} orderId 
   * @param {string} status - 'confirmed', 'shipping', 'completed', 'cancelled'
   */
  updateOrderStatus: (orderId, status) => {
    return apiClient.put(ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { status });
  },
};

/**
 * Farm / Supplier API service
 */
export const farmApi = {
  getFarms: (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('pageNumber', params.pageNumber);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    if (params.search) query.append('search', params.search);
    const queryStr = query.toString();
    return apiClient.get(`${ENDPOINTS.FARMS.LIST}${queryStr ? `?${queryStr}` : ''}`);
  },

  getFarmById: (id) => {
    return apiClient.get(ENDPOINTS.FARMS.DETAIL(id));
  },
};

