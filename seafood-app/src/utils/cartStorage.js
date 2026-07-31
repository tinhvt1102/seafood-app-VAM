/**
 * Utility quản lý lưu trữ Giỏ hàng cho Frontend (LocalStorage + Cookie Fallback)
 */

// Key tiền tố cho giỏ hàng
const CART_PREFIX = 'seafood_cart_';

/**
 * Hàm ghi Cookie an toàn với Hạn sử dụng (mặc định 7 ngày)
 */
export function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.error('Không thể ghi Cookie:', e);
  }
}

/**
 * Hàm đọc Cookie an toàn
 */
export function getCookie(name) {
  try {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length)));
      }
    }
  } catch (e) {
    console.error('Không thể đọc Cookie:', e);
  }
  return null;
}

/**
 * Hàm xóa Cookie
 */
export function eraseCookie(name) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

/**
 * Lấy danh sách sản phẩm trong giỏ hàng (Thử LocalStorage trước, nếu lỗi/trống thử Cookie)
 */
export function getStoredCart(userId = null) {
  const key = userId ? `${CART_PREFIX}${userId}` : `${CART_PREFIX}guest`;
  
  // 1. Thử lấy từ LocalStorage
  try {
    const localData = localStorage.getItem(key);
    if (localData) {
      return JSON.parse(localData);
    }
  } catch (e) {
    console.warn('LocalStorage bị chặn hoặc không khả dụng, chuyển sang Cookie fallback', e);
  }

  // 2. Fallback sang Cookie nếu LocalStorage không có hoặc bị vô hiệu hóa
  const cookieData = getCookie(key);
  if (cookieData) {
    return cookieData;
  }

  return [];
}

/**
 * Lưu giỏ hàng đồng thời vào cả LocalStorage và Cookie
 */
export function saveStoredCart(cartItems, userId = null) {
  const key = userId ? `${CART_PREFIX}${userId}` : `${CART_PREFIX}guest`;
  const cartJson = JSON.stringify(cartItems || []);

  // 1. Lưu vào LocalStorage
  try {
    localStorage.setItem(key, cartJson);
  } catch (e) {
    console.warn('Không thể lưu giỏ hàng vào LocalStorage:', e);
  }

  // 2. Lưu vào Cookie (hạn 7 ngày)
  setCookie(key, cartItems, 7);
}

/**
 * Xóa sạch giỏ hàng khỏi cả LocalStorage và Cookie
 */
export function clearStoredCart(userId = null) {
  const key = userId ? `${CART_PREFIX}${userId}` : `${CART_PREFIX}guest`;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Không thể xóa giỏ hàng khỏi LocalStorage:', e);
  }
  eraseCookie(key);
}
