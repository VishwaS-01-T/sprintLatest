import React, { useState } from 'react';
import { Star, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { reviewsApi } from '../lib/api';

/**
 * Interactive star picker.
 */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-8 h-8 transition-all duration-150 ${
                i <= active
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-neutral-200 text-neutral-200'
              }`}
            />
          </button>
        ))}
      </div>
      {active > 0 && (
        <span className="text-sm font-semibold text-amber-600">{labels[active]}</span>
      )}
    </div>
  );
}

/**
 * Field wrapper with label and optional error.
 */
function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-neutral-800">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl border-2 border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 transition-colors bg-white';

/**
 * WriteReview — form to submit a review for a product.
 * Schema: rating (1-5 int, required), title (required), comment/reviewText (optional), images[] (optional URLs)
 * POST /api/products/:productId/reviews  — requires auth bearer token.
 */
const WriteReview = ({ productId, productName, onReviewSubmitted }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userName = useAuthStore((s) => s.userName);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageUrls, setImageUrls] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  // ---- Validation ----
  const validate = () => {
    const e = {};
    if (!rating || rating < 1 || rating > 5) e.rating = 'Please select a rating.';
    if (!title.trim()) e.title = 'Review title is required.';
    else if (title.trim().length > 255) e.title = 'Title must be under 255 characters.';

    // Optional image URLs — validate each if provided
    if (imageUrls.trim()) {
      const urls = imageUrls.split(',').map((u) => u.trim()).filter(Boolean);
      const invalid = urls.filter((u) => {
        try { new URL(u); return false; } catch { return true; }
      });
      if (invalid.length > 0) e.images = 'One or more image URLs are invalid.';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const images = imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);

    const payload = {
      rating,
      reviewTitle: title.trim(),
      ...(comment.trim() && { reviewText: comment.trim() }),
      ...(images.length > 0 && { images }),
    };

    try {
      setSubmitting(true);
      await reviewsApi.createReview(productId, payload, accessToken);
      setSubmitted(true);
      onReviewSubmitted?.();
    } catch (err) {
      setServerError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Not logged in ----
  if (!isLoggedIn) {
    return (
      <div className="max-w-xl animate-fade-in">
        <div className="flex flex-col items-center gap-4 py-14 px-8 bg-neutral-50 rounded-2xl text-center">
          <div className="p-4 bg-neutral-100 rounded-full">
            <Lock className="w-6 h-6 text-neutral-400" />
          </div>
          <div>
            <p className="text-base font-bold text-neutral-900 mb-1">Sign in to leave a review</p>
            <p className="text-sm text-neutral-500">
              Only signed-in customers can submit product reviews.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- Success state ----
  if (submitted) {
    return (
      <div className="max-w-xl animate-fade-in">
        <div className="flex flex-col items-center gap-4 py-14 px-8 bg-green-50 rounded-2xl text-center">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="text-base font-bold text-neutral-900 mb-1">Review submitted!</p>
            <p className="text-sm text-neutral-500">
              Thank you for your feedback on <span className="font-semibold">{productName}</span>.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setRating(0);
              setTitle('');
              setComment('');
              setImageUrls('');
              setErrors({});
            }}
            className="mt-2 text-sm font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors"
          >
            Write another review
          </button>
        </div>
      </div>
    );
  }

  // ---- Form ----
  return (
    <div className="max-w-xl animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900">Write a Review</h2>
        {productName && (
          <p className="text-sm text-neutral-500 mt-1">
            Reviewing <span className="font-medium text-neutral-700">{productName}</span>
            {userName && (
              <> as <span className="font-medium text-neutral-700">{userName}</span></>
            )}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Rating */}
        <Field label="Your Rating" required error={errors.rating}>
          <StarPicker value={rating} onChange={(v) => { setRating(v); setErrors((p) => ({ ...p, rating: undefined })); }} />
        </Field>

        {/* Title */}
        <Field label="Review Title" required error={errors.title}>
          <input
            type="text"
            className={`${inputCls} ${errors.title ? 'border-rose-400' : ''}`}
            placeholder="Sum up your experience in a line"
            value={title}
            maxLength={255}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
          />
          <p className="text-xs text-neutral-400 text-right">{title.length}/255</p>
        </Field>

        {/* Comment */}
        <Field label="Your Review" error={errors.comment}>
          <textarea
            rows={4}
            className={`${inputCls} resize-none ${errors.comment ? 'border-rose-400' : ''}`}
            placeholder="Tell others what you think about this product — fit, comfort, quality…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Field>

        {/* Image URLs */}
        <Field
          label="Add Photo URLs"
          error={errors.images}
        >
          <input
            type="text"
            className={`${inputCls} ${errors.images ? 'border-rose-400' : ''}`}
            placeholder="Comma-separated image URLs (optional)"
            value={imageUrls}
            onChange={(e) => { setImageUrls(e.target.value); setErrors((p) => ({ ...p, images: undefined })); }}
          />
          <p className="text-xs text-neutral-400">Separate multiple URLs with a comma</p>
        </Field>

        {/* Server error */}
        {serverError && (
          <div className="flex items-start gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;
