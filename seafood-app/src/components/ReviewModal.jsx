import React, { useState, useEffect } from 'react';
import { Star, X, Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { reviewsApi } from '../api';

const RATING_LABELS = {
  1: '1/5 - Rất tệ',
  2: '2/5 - Tệ',
  3: '3/5 - Bình thường',
  4: '4/5 - Tốt',
  5: '5/5 - Tuyệt vời'
};

export function ReviewModal({ isOpen, onClose, orderId, product, existingReview = null, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [keepImageUrls, setKeepImageUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setComment(existingReview.comment || '');
      setExistingImages(existingReview.imageUrls || []);
      setKeepImageUrls(existingReview.imageUrls || []);
    } else {
      setRating(5);
      setComment('');
      setImages([]);
      setImagePreviews([]);
      setExistingImages([]);
      setKeepImageUrls([]);
    }
    setError(null);
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCurrentCount = keepImageUrls.length + images.length + files.length;
    if (totalCurrentCount > 5) {
      setError('Bạn chỉ được đính kèm tối đa 5 hình ảnh.');
      return;
    }
    setError(null);

    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveExistingImage = (url) => {
    setKeepImageUrls(keepImageUrls.filter(u => u !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError('Vui lòng chọn số sao đánh giá (1 đến 5 sao).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('rating', rating);
      if (comment.trim()) {
        formData.append('comment', comment.trim());
      }

      if (existingReview) {
        // Edit mode
        formData.append('id', existingReview.id);
        keepImageUrls.forEach(url => formData.append('keepImageUrls', url));
        images.forEach(file => formData.append('newImages', file));

        await reviewsApi.updateReview(existingReview.id, formData);
      } else {
        // Create mode
        formData.append('orderId', orderId);
        formData.append('productId', product?.id || product?.productId);
        images.forEach(file => formData.append('images', file));

        await reviewsApi.createReview(formData);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {existingReview ? 'Chỉnh sửa Đánh giá' : 'Đánh giá Sản phẩm'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Product Header Card */}
          {product && (
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <img 
                src={product.image || product.imageUrls?.[0] || 'https://via.placeholder.com/60'} 
                alt={product.name || product.productName}
                className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 truncate">
                  {product.name || product.productName}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">Mã đơn hàng: #{orderId}</p>
              </div>
            </div>
          )}

          {/* Star Selection */}
          <div className="text-center space-y-2 py-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Chất lượng sản phẩm
            </label>

            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform duration-150 hover:scale-125 focus:outline-none"
                >
                  <Star 
                    className="w-8 h-8 transition-colors duration-150"
                    fill={star <= activeRating ? '#FFD700' : 'none'}
                    stroke={star <= activeRating ? '#FFD700' : '#D1D5DB'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-amber-600 min-h-[1.25rem]">
              {RATING_LABELS[activeRating]}
            </p>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nhận xét chi tiết
            </label>
            <textarea
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về độ tươi sống, đóng gói và dịch vụ giao hàng..."
              className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none resize-none"
            />
            <div className="text-right text-xs text-gray-400">
              {comment.length}/500 ký tự
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Hình ảnh thực tế (Tối đa 5 ảnh)
            </label>

            <div className="grid grid-cols-5 gap-2">
              {/* Existing Images */}
              {keepImageUrls.map((url, idx) => (
                <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-opacity opacity-90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* New Previews */}
              {imagePreviews.map((src, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-opacity opacity-90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {keepImageUrls.length + images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-cyan-500 rounded-lg cursor-pointer transition-colors bg-gray-50 hover:bg-cyan-50/30">
                  <Upload className="w-5 h-5 text-gray-400 hover:text-cyan-600 mb-1" />
                  <span className="text-[10px] text-gray-500 font-medium">Thêm ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>{existingReview ? 'Lưu thay đổi' : 'Gửi đánh giá'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
