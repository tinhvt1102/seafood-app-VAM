import { useState, useEffect } from 'react';
import {
  Search, CheckCircle, XCircle, Clock, Eye, Package, Filter,
  Loader2, ChevronLeft, ChevronRight, X, AlertTriangle,
  ShieldCheck, ImageIcon, User, MapPin, Tag
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productApi } from '../../api/products';

export function ProductApprovalPage({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Detail modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectProductId, setRejectProductId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // productId being processed

  // Fetch products
  const fetchProducts = async (page = 1, status = 'pending', search = '') => {
    setLoading(true);
    try {
      const filter = { pageNumber: page, pageSize };
      if (status !== 'all') filter.status = status;
      if (search.trim()) filter.search = search.trim();

      const data = await productApi.getProducts(filter);
      const items = data?.items || data || [];
      const total = data?.totalCount || items.length;

      setProducts(items);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      toast.error('Không thể tải danh sách sản phẩm.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const [pendingData, approvedData, rejectedData] = await Promise.all([
        productApi.getProducts({ pageSize: 1, status: 'pending' }),
        productApi.getProducts({ pageSize: 1, status: 'approved' }),
        productApi.getProducts({ pageSize: 1, status: 'rejected' }),
      ]);
      setStats({
        pending: pendingData?.totalCount || 0,
        approved: approvedData?.totalCount || 0,
        rejected: rejectedData?.totalCount || 0,
      });
    } catch {
      // Non-critical
    }
  };

  useEffect(() => {
    fetchProducts(1, statusFilter, searchTerm);
    fetchStats();
  }, []);

  useEffect(() => {
    fetchProducts(1, statusFilter, searchTerm);
  }, [statusFilter]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1, statusFilter, searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Approve product
  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await productApi.approveProduct(id, { status: 'approved' });
      toast.success('Đã phê duyệt sản phẩm thành công!');
      fetchProducts(currentPage, statusFilter, searchTerm);
      fetchStats();
      if (showDetailModal && selectedProduct?.id === id) {
        setShowDetailModal(false);
        setSelectedProduct(null);
      }
    } catch (err) {
      toast.error(err.message || 'Phê duyệt thất bại.');
    } finally {
      setActionLoading(null);
    }
  };

  // Open reject modal
  const openRejectModal = (id) => {
    setRejectProductId(id);
    setRejectNote('');
    setShowRejectModal(true);
  };

  // Submit rejection
  const handleReject = async () => {
    if (!rejectNote.trim()) {
      toast.error('Vui lòng nhập lý do từ chối.');
      return;
    }
    setActionLoading(rejectProductId);
    try {
      await productApi.approveProduct(rejectProductId, {
        status: 'rejected',
        note: rejectNote.trim()
      });
      toast.success('Đã từ chối sản phẩm.');
      setShowRejectModal(false);
      setRejectProductId(null);
      setRejectNote('');
      fetchProducts(currentPage, statusFilter, searchTerm);
      fetchStats();
      if (showDetailModal && selectedProduct?.id === rejectProductId) {
        setShowDetailModal(false);
        setSelectedProduct(null);
      }
    } catch (err) {
      toast.error(err.message || 'Từ chối thất bại.');
    } finally {
      setActionLoading(null);
    }
  };

  // View detail
  const handleViewDetail = async (product) => {
    try {
      const detail = await productApi.getProductById(product.id);
      setSelectedProduct(detail);
      setActiveImageIndex(0);
      setShowDetailModal(true);
    } catch {
      // Fallback to list data
      setSelectedProduct(product);
      setActiveImageIndex(0);
      setShowDetailModal(true);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: '#FEF3C7', text: '#D97706', label: 'Chờ duyệt', icon: Clock },
      approved: { bg: '#D1FAE5', text: '#059669', label: 'Đã duyệt', icon: CheckCircle },
      rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Từ chối', icon: XCircle },
      out_of_stock: { bg: '#E5E7EB', text: '#374151', label: 'Hết hàng', icon: AlertTriangle },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate?.('admin-dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8" style={{ color: '#00BCD4' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#0A2647' }}>Duyệt sản phẩm</h1>
          </div>
          <p className="text-gray-600">Xem xét và phê duyệt các sản phẩm được đăng bởi Seller</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderLeftColor: '#D97706' }}
            onClick={() => setStatusFilter('pending')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                <h3 className="text-3xl font-bold" style={{ color: '#D97706' }}>{stats.pending}</h3>
              </div>
              <Clock className="w-12 h-12 p-2.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }} />
            </div>
          </div>
          <div
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderLeftColor: '#059669' }}
            onClick={() => setStatusFilter('approved')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
                <h3 className="text-3xl font-bold" style={{ color: '#059669' }}>{stats.approved}</h3>
              </div>
              <CheckCircle className="w-12 h-12 p-2.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#059669' }} />
            </div>
          </div>
          <div
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderLeftColor: '#DC2626' }}
            onClick={() => setStatusFilter('rejected')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Từ chối</p>
                <h3 className="text-3xl font-bold" style={{ color: '#DC2626' }}>{stats.rejected}</h3>
              </div>
              <XCircle className="w-12 h-12 p-2.5 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }} />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium" style={{ color: '#0A2647' }}>Lọc:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>

            <div className="flex-1 max-w-md ml-auto relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-[#00BCD4]"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#00BCD4' }} />
              <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b" style={{ borderColor: '#e5e7eb' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Sản phẩm</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Người bán</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Danh mục</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Giá</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Số lượng</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Trạng thái</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: '#0A2647' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 font-medium">Không có sản phẩm nào</p>
                          <p className="text-sm text-gray-400 mt-1">Thay đổi bộ lọc để xem kết quả khác</p>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const statusConfig = getStatusConfig(product.status);
                        const StatusIcon = statusConfig.icon;
                        const thumbnail = product.imageUrls?.[0] || null;
                        const isProcessing = actionLoading === product.id;

                        return (
                          <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#e5e7eb' }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {thumbnail ? (
                                  <img
                                    src={thumbnail}
                                    alt={product.name}
                                    className="w-14 h-14 rounded-lg object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ borderColor: '#e5e7eb' }}
                                    onClick={() => handleViewDetail(product)}
                                  />
                                ) : (
                                  <div
                                    className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                    onClick={() => handleViewDetail(product)}
                                  >
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                  </div>
                                )}
                                <div>
                                  <p
                                    className="font-medium cursor-pointer hover:underline"
                                    style={{ color: '#0A2647' }}
                                    onClick={() => handleViewDetail(product)}
                                  >
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">ID: {product.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{product.sellerName || `Seller #${product.sellerId}`}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">{product.categoryName || '—'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-semibold" style={{ color: '#0A2647' }}>{formatPrice(product.price)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">{product.quantity} {product.unit}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full" style={{ backgroundColor: statusConfig.bg }}>
                                  <StatusIcon className="w-4 h-4" style={{ color: statusConfig.text }} />
                                </div>
                                <span className="text-sm font-medium" style={{ color: statusConfig.text }}>
                                  {statusConfig.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewDetail(product)}
                                  className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors cursor-pointer"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                {product.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(product.id)}
                                      disabled={isProcessing}
                                      className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                      style={{ backgroundColor: '#059669' }}
                                      title="Phê duyệt"
                                    >
                                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                      Duyệt
                                    </button>
                                    <button
                                      onClick={() => openRejectModal(product.id)}
                                      disabled={isProcessing}
                                      className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                      style={{ backgroundColor: '#DC2626' }}
                                      title="Từ chối"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Từ chối
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                  <p className="text-sm text-gray-500">
                    Hiển thị {products.length} / {totalCount} sản phẩm
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchProducts(currentPage - 1, statusFilter, searchTerm)}
                      disabled={currentPage <= 1}
                      className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium px-3" style={{ color: '#0A2647' }}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => fetchProducts(currentPage + 1, statusFilter, searchTerm)}
                      disabled={currentPage >= totalPages}
                      className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ==================== DETAIL MODAL ==================== */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl z-10" style={{ borderColor: '#e5e7eb' }}>
              <h2 className="text-lg font-bold" style={{ color: '#0A2647' }}>Chi tiết sản phẩm</h2>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedProduct(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Gallery */}
              {selectedProduct.imageUrls?.length > 0 && (
                <div>
                  <div className="rounded-xl overflow-hidden border mb-3" style={{ borderColor: '#e5e7eb' }}>
                    <img
                      src={selectedProduct.imageUrls[activeImageIndex]}
                      alt={selectedProduct.name}
                      className="w-full h-80 object-contain bg-gray-50"
                    />
                  </div>
                  {selectedProduct.imageUrls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className="w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all"
                          style={{
                            borderColor: idx === activeImageIndex ? '#00BCD4' : '#e5e7eb',
                            opacity: idx === activeImageIndex ? 1 : 0.6
                          }}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Product Info */}
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0A2647' }}>{selectedProduct.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const sc = getStatusConfig(selectedProduct.status);
                    const SI = sc.icon;
                    return (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        <SI className="w-4 h-4" />
                        {sc.label}
                      </span>
                    );
                  })()}
                  <span className="text-2xl font-bold" style={{ color: '#00BCD4' }}>{formatPrice(selectedProduct.price)}</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase font-medium">Người bán</span>
                  </div>
                  <p className="font-medium" style={{ color: '#0A2647' }}>{selectedProduct.sellerName || `Seller #${selectedProduct.sellerId}`}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase font-medium">Danh mục</span>
                  </div>
                  <p className="font-medium" style={{ color: '#0A2647' }}>{selectedProduct.categoryName || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase font-medium">Tồn kho</span>
                  </div>
                  <p className="font-medium" style={{ color: '#0A2647' }}>{selectedProduct.quantity} {selectedProduct.unit}</p>
                </div>
                {selectedProduct.farmName && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 uppercase font-medium">Trang trại</span>
                    </div>
                    <p className="font-medium" style={{ color: '#0A2647' }}>{selectedProduct.farmName}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-2">Mô tả</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedProduct.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApprove(selectedProduct.id)}
                    disabled={actionLoading === selectedProduct.id}
                    className="flex-1 px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#059669' }}
                  >
                    {actionLoading === selectedProduct.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Phê duyệt sản phẩm
                  </button>
                  <button
                    onClick={() => openRejectModal(selectedProduct.id)}
                    disabled={actionLoading === selectedProduct.id}
                    className="flex-1 px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#DC2626' }}
                  >
                    <XCircle className="w-5 h-5" />
                    Từ chối sản phẩm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== REJECT MODAL ==================== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold" style={{ color: '#0A2647' }}>Từ chối sản phẩm</h3>
              </div>
              <button
                onClick={() => { setShowRejectModal(false); setRejectProductId(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Nhập lý do từ chối sản phẩm này..."
                rows={4}
                className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                style={{ borderColor: '#e5e7eb' }}
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                Lý do sẽ được hiển thị cho Seller để họ chỉnh sửa và gửi lại.
              </p>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: '#e5e7eb' }}>
              <button
                onClick={() => { setShowRejectModal(false); setRejectProductId(null); }}
                className="px-5 py-2.5 border rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: '#e5e7eb' }}
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectProductId}
                className="px-5 py-2.5 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
                style={{ backgroundColor: '#DC2626' }}
              >
                {actionLoading === rejectProductId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
