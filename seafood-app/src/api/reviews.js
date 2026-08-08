import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const reviewsApi = {
  /**
   * Lấy danh sách đánh giá có lọc & phân trang
   * @param {Object} filter - { productId, sellerId, rating, hasImages, pageNumber, pageSize, sortBy }
   */
  getReviews: (filter = {}) => {
    const params = new URLSearchParams();
    if (filter.productId) params.append('productId', filter.productId);
    if (filter.sellerId) params.append('sellerId', filter.sellerId);
    if (filter.rating) params.append('rating', filter.rating);
    if (filter.hasImages !== undefined && filter.hasImages !== null) params.append('hasImages', filter.hasImages);
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
    if (filter.pageSize) params.append('pageSize', filter.pageSize);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    const query = params.toString();
    return apiClient.get(`${ENDPOINTS.REVIEWS.LIST}${query ? `?${query}` : ''}`);
  },

  /**
   * Lấy thống kê đánh giá của 1 sản phẩm
   */
  getProductSummary: (productId) => {
    return apiClient.get(ENDPOINTS.REVIEWS.PRODUCT_SUMMARY(productId));
  },

  /**
   * Lấy thống kê đánh giá của 1 shop/seller
   */
  getSellerSummary: (sellerId) => {
    return apiClient.get(ENDPOINTS.REVIEWS.SELLER_SUMMARY(sellerId));
  },

  /**
   * Kiểm tra xem user có quyền đánh giá sản phẩm trong đơn hàng không
   */
  canUserReview: (orderId, productId) => {
    return apiClient.get(`${ENDPOINTS.REVIEWS.CAN_REVIEW}?orderId=${orderId}&productId=${productId}`);
  },

  /**
   * Tạo đánh giá mới (dạng FormData có kèm file)
   */
  createReview: (formData) => {
    return apiClient.post(ENDPOINTS.REVIEWS.CREATE, formData);
  },

  /**
   * Chỉnh sửa đánh giá (Edit review)
   */
  updateReview: (id, formData) => {
    return apiClient.put(ENDPOINTS.REVIEWS.UPDATE(id), formData);
  },

  /**
   * Seller gửi phản hồi cho đánh giá
   */
  replyReview: (id, reply) => {
    return apiClient.post(ENDPOINTS.REVIEWS.REPLY(id), { reply });
  }
};
