import { useState, useEffect } from 'react';
import { Edit, Send, Trash2, Eye, AlertCircle, CheckCircle, Clock, XCircle, Package, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productApi } from '../../api/products';

export function ListingManagementPage({ onNavigate }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [wholesaleFilter, setWholesaleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  // Fetch products từ API
  const fetchListings = async (page = 1, status = 'all', wholesale = 'all') => {
    setLoading(true);
    try {
      const filter = {
        pageNumber: page,
        pageSize,
      };
      if (status !== 'all') {
        filter.status = status;
      }
      if (wholesale === 'wholesale') {
        filter.isWholesale = true;
      } else if (wholesale === 'retail') {
        filter.isWholesale = false;
      }
      const data = await productApi.getProducts(filter);

      // API trả về { items: [...], totalCount, pageNumber, pageSize } hoặc mảng
      const items = data?.items || data || [];
      const total = data?.totalCount || items.length;

      setListings(items);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      toast.error('Không thể tải danh sách bài đăng.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats riêng (tổng số sản phẩm theo trạng thái)
  const fetchStats = async () => {
    try {
      const [allData, pendingData, approvedData, rejectedData] = await Promise.all([
        productApi.getProducts({ pageSize: 1 }),
        productApi.getProducts({ pageSize: 1, status: 'pending' }),
        productApi.getProducts({ pageSize: 1, status: 'approved' }),
        productApi.getProducts({ pageSize: 1, status: 'rejected' }),
      ]);
      setStats({
        total: allData?.totalCount || 0,
        pending: pendingData?.totalCount || 0,
        approved: approvedData?.totalCount || 0,
        rejected: rejectedData?.totalCount || 0,
      });
    } catch {
      // Stats không quan trọng, bỏ qua lỗi
    }
  };

  useEffect(() => {
    fetchListings(1, statusFilter, wholesaleFilter);
    fetchStats();
  }, []);

  // Khi đổi filter → reset về trang 1
  useEffect(() => {
    fetchListings(1, statusFilter, wholesaleFilter);
  }, [statusFilter, wholesaleFilter]);

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Nháp',
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      out_of_stock: 'Hết hàng'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: { bg: '#F3F4F6', text: '#6B7280', icon: Edit },
      pending: { bg: '#FEF3C7', text: '#D97706', icon: Clock },
      approved: { bg: '#D1FAE5', text: '#059669', icon: CheckCircle },
      rejected: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
      out_of_stock: { bg: '#E5E7EB', text: '#374151', icon: AlertCircle }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', icon: Edit };
  };

  const handleEdit = (id) => {
    onNavigate('seller-center');
  };

  const handleResubmit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('Status', 'pending');
      await productApi.updateProduct(id, formData);
      toast.success('Đã gửi lại bài đăng để xét duyệt thành công!');
      fetchListings(currentPage, statusFilter);
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Gửi lại thất bại.');
    }
  };

  const handleDelete = (id) => {
    const targetListing = listings.find(l => l.id === id);
    const listingName = targetListing ? targetListing.name : 'bài đăng';

    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-900">
          Bạn có chắc chắn muốn xóa <strong>{listingName}</strong>?
        </span>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await productApi.deleteProduct(id);
                toast.error('Đã xóa bài đăng khỏi hệ thống!');
                fetchListings(currentPage, statusFilter);
                fetchStats();
              } catch (err) {
                toast.error(err.message || 'Xóa thất bại.');
              }
            }}
            className="px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const handleViewDetails = (id) => {
    onNavigate('product-detail', id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0A2647' }}>Quản lý bài đăng</h1>
          <p className="text-gray-600">Quản lý tất cả bài đăng sản lượng và sản phẩm của bạn</p>
        </div>

        {/* Filters */}
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
              <option value="out_of_stock">Hết hàng</option>
            </select>

            <select
              value={wholesaleFilter}
              onChange={(e) => setWholesaleFilter(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
            >
              <option value="all">Tất cả bài đăng</option>
              <option value="retail">Bán lẻ</option>
              <option value="wholesale">Bán sỉ / Sản lượng lớn</option>
            </select>

            <div className="ml-auto">
              <button
                onClick={() => onNavigate('seller-center')}
                className="px-6 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#00BCD4' }}
              >
                + Tạo bài đăng mới
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng bài đăng</p>
                <h3 className="text-2xl font-bold" style={{ color: '#0A2647' }}>{stats.total}</h3>
              </div>
              <Package className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#E0F7FA', color: '#00BCD4' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
                <h3 className="text-2xl font-bold" style={{ color: '#059669' }}>{stats.approved}</h3>
              </div>
              <CheckCircle className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#059669' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                <h3 className="text-2xl font-bold" style={{ color: '#D97706' }}>{stats.pending}</h3>
              </div>
              <Clock className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Từ chối</p>
                <h3 className="text-2xl font-bold" style={{ color: '#DC2626' }}>{stats.rejected}</h3>
              </div>
              <XCircle className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }} />
            </div>
          </div>
        </div>

        {/* Table */}
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
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Danh mục</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Giá</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Tồn kho</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Trạng thái</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          Không có bài đăng nào
                        </td>
                      </tr>
                    ) : (
                      listings.map((listing) => {
                        const statusConfig = getStatusColor(listing.status);
                        const StatusIcon = statusConfig.icon;
                        const thumbnail = listing.imageUrls?.[0] || null;

                        return (
                          <tr key={listing.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {thumbnail ? (
                                  <img
                                    src={thumbnail}
                                    alt={listing.name}
                                    className="w-12 h-12 rounded-md object-cover border"
                                    style={{ borderColor: '#e5e7eb' }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-300" />
                                  </div>
                                )}
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium flex items-center gap-2" style={{ color: '#0A2647' }}>
                                    {listing.name}
                                    {listing.isWholesale && (
                                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                                        Sản lượng lớn
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {listing.categoryName || '—'}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium" style={{ color: '#0A2647' }}>
                              {formatPrice(listing.price)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div>{listing.quantity} {listing.unit}</div>
                              {(listing.isWholesale || (listing.minOrderQuantity && listing.minOrderQuantity > 1)) && (
                                <div className="text-xs text-cyan-700 font-medium mt-0.5">
                                  Tối thiểu: {listing.minOrderQuantity || 1} {listing.unit}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full" style={{ backgroundColor: statusConfig.bg }}>
                                  <StatusIcon className="w-4 h-4" style={{ color: statusConfig.text }} />
                                </div>
                                <span className="text-sm font-medium" style={{ color: statusConfig.text }}>
                                  {getStatusLabel(listing.status)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {(listing.status === 'draft' || listing.status === 'rejected') && (
                                  <button
                                    onClick={() => handleEdit(listing.id)}
                                    className="p-2 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                    style={{ color: '#00BCD4' }}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                )}
                                {(listing.status === 'rejected' || listing.status === 'draft') && (
                                  <button
                                    onClick={() => handleResubmit(listing.id)}
                                    className="p-2 hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                                    style={{ color: '#059669' }}
                                    title="Gửi lại duyệt"
                                  >
                                    <Send className="w-5 h-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleViewDetails(listing.id)}
                                  className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors cursor-pointer"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(listing.id)}
                                  className="p-2 hover:bg-red-50 rounded-md text-red-500 transition-colors cursor-pointer"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
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
                    Hiển thị {listings.length} / {totalCount} bài đăng
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchListings(currentPage - 1, statusFilter, wholesaleFilter)}
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
                      onClick={() => fetchListings(currentPage + 1, statusFilter, wholesaleFilter)}
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

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: '#0A2647' }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#00BCD4' }} />
            Trạng thái bài đăng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Chờ duyệt:</strong>
              <p className="text-gray-600">Đang chờ Admin xem xét và phê duyệt</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Đã duyệt:</strong>
              <p className="text-gray-600">Đã được phê duyệt và hiển thị công khai</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Từ chối:</strong>
              <p className="text-gray-600">Bị từ chối, cần chỉnh sửa và gửi lại</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Hết hàng:</strong>
              <p className="text-gray-600">Sản phẩm đã hết hàng tạm thời</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}