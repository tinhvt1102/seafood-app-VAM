/**
 * Product API service - handles all product-related API calls
 * Endpoints: GET/POST/PUT/DELETE /Products, PUT /Products/{id}/approve
 */
import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const productApi = {
  /**
   * Lấy danh sách sản phẩm có filter & phân trang
   * @param {Object} filter - { pageNumber, pageSize, search, status, categoryId, farmId, minPrice, maxPrice }
   */
  getProducts: (filter = {}) => {
    const params = new URLSearchParams();
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
    if (filter.pageSize) params.append('pageSize', filter.pageSize);
    if (filter.search) params.append('search', filter.search);
    if (filter.status) params.append('status', filter.status);
    if (filter.categoryId) params.append('categoryId', filter.categoryId);
    if (filter.farmId) params.append('farmId', filter.farmId);
    if (filter.minPrice) params.append('minPrice', filter.minPrice);
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice);
    const query = params.toString();
    return apiClient.get(`${ENDPOINTS.PRODUCTS.LIST}${query ? `?${query}` : ''}`);
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
