import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle, ChevronDown, Loader2, X } from 'lucide-react';
import { reviewsApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import { useRouter } from '../hooks/useRouter';
import showToast from '../utils/toast';

/**
 * Star display helper — renders 5 stars, filled up to `rating`.
 */
function StarRow({ rating, size = 'sm' }) {
  const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} ${
            i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Single review card.
 */
function ReviewCard({ review }) {
  const initials = (review.customer?.firstName?.[0] || 'A').toUpperCase();
  const name = review.customer
    ? `${review.customer.firstName || ''} ${review.customer.lastName || ''}`.trim()
    : 'Anonymous';
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="py-6 border-b border-neutral-100 last:border-0 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-sm font-bold text-amber-700">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="text-sm font-bold text-neutral-900">{name}</span>
            {review.verifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified Purchase
              </span>
            )}
            <span className="text-xs text-neutral-400 ml-auto">{date}</span>
          </div>

          {/* Stars */}
          <StarRow rating={review.rating} />

          {/* Title */}
          {review.reviewTitle && (
            <p className="text-sm font-semibold text-neutral-900 mt-2">{review.reviewTitle}</p>
          )}

          {/* Body */}
          {review.reviewText && (
            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{review.reviewText}</p>
          )}

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review image ${idx + 1}`}
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-100"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Rating breakdown bar.
 */
function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500 w-4 shrink-0">{star}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-neutral-400 w-8 text-right shrink-0">{count}</span>
    </div>
  );
}

/**
 * Write Review Modal
 */
function WriteReviewModal({ productId, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.createReview(productId, {
        rating,
        reviewTitle: title,
        reviewText: text,
      });
      showToast.success('Review submitted successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      showToast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">
              Rating <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Text */}
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">
              Your Review
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your experience with this product"
              rows={5}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-neutral-400 mt-1">{text.length}/1000</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-neutral-200 rounded-xl font-bold text-neutral-700 hover:border-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 px-6 py-3 bg-amber-400 rounded-xl font-bold text-neutral-900 hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * ProductReviews — fetches and displays paginated reviews for a product.
 */
const ProductReviews = ({ productId, averageRating, reviewCount }) => {
  const { navigate } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null); // { page, limit, total, totalPages }
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showWriteModal, setShowWriteModal] = useState(false);

  const fetchReviews = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await reviewsApi.getProductReviews(productId, { page: pageNum, limit: 5 });
      const data = res.data;
      const pagination = data.pagination || data.meta || null;

      setReviews((prev) => (append ? [...prev, ...(data.reviews || [])] : (data.reviews || [])));
      setMeta(pagination);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [productId]);

  useEffect(() => {
    setPage(1);
    fetchReviews(1, false);
  }, [productId, fetchReviews]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchReviews(next, true);
  };

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      showToast.info('Please login to write a review');
      navigate('/login');
      return;
    }
    setShowWriteModal(true);
  };

  const handleReviewSuccess = () => {
    setPage(1);
    fetchReviews(1, false);
  };

  // Build breakdown from loaded reviews (approximate — real breakdown would need API support)
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading reviews…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-rose-500 mb-4">{error}</p>
        <button
          onClick={() => fetchReviews(1)}
          className="text-sm font-semibold text-neutral-700 underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl animate-fade-in">
      {/* Write Review Modal */}
      {showWriteModal && (
        <WriteReviewModal
          productId={productId}
          onClose={() => setShowWriteModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* Header with Write Review Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Customer Reviews</h2>
        <button
          onClick={handleWriteReview}
          className="px-6 py-2.5 bg-amber-400 rounded-xl font-bold text-neutral-900 hover:bg-amber-500 transition-colors hover-lift"
        >
          Write a Review
        </button>
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-neutral-50 rounded-2xl">
        {/* Overall score */}
        <div className="flex flex-col items-center justify-center gap-2 shrink-0">
          <span className="text-5xl font-bold text-neutral-900 leading-none">
            {averageRating ? Number(averageRating).toFixed(1) : '—'}
          </span>
          <StarRow rating={Math.round(averageRating || 0)} size="lg" />
          <span className="text-xs text-neutral-500">{reviewCount || 0} reviews</span>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2 justify-center flex flex-col">
          {breakdown.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* List */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-neutral-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Load more */}
      {meta && page < meta.totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 border-neutral-200 rounded-xl hover:border-amber-400 hover:text-amber-600 transition-all disabled:opacity-50"
          >
            {loadingMore ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Load more reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
