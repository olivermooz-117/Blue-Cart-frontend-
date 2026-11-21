import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchReviews, submitReview } from "../store/reviewsSlice";
import "../styles/search.css";

const STAR_LABELS = { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" };

export default function Reviews({ query }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.email);
  const reviewsState = useSelector((state) => state.reviews.byQuery[query] || {
    reviews: [],
    status: "idle",
    error: null,
  });
  const { reviews, status, error } = reviewsState;

  const [author, setAuthor] = useState(email || "");
  const [shop, setShop] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch reviews whenever the query changes.
  useEffect(() => {
    if (query) {
      dispatch(fetchReviews({ query }));
    }
  }, [query, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!comment.trim() || !shop.trim() || !author.trim()) {
      setSubmitError("Author, shop and comment are required.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    dispatch(
      submitReview({
        query,
        shop: shop.trim(),
        author: author.trim(),
        comment: comment.trim(),
        rating: Number(rating),
      })
    ).then(
      () => {
        setSubmitting(false);
        setShop("");
        setComment("");
        setRating(5);
      },
      () => {
        setSubmitting(false);
        setSubmitError("Failed to submit review. Please try again.");
      }
    );
  };

  if (status === "loading") {
    return (
      <section className="reviews-panel">
        <h3>Reviews</h3>
        <p className="reviews-message">Loading reviews…</p>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="reviews-panel">
        <h3>Reviews</h3>
        <p className="reviews-message error">
          Couldn't load reviews: {error}
        </p>
      </section>
    );
  }

  return (
    <section className="reviews-panel">
      <h3>Reviews</h3>

      <form className="review-form" onSubmit={handleSubmit} noValidate>
        <div className="review-form-row">
          <label>
            Author
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Your name"
              disabled={!!token}
            />
          </label>
          <label>
            Shop
            <input
              value={shop}
              onChange={(event) => setShop(event.target.value)}
              placeholder="e.g. Amazon, eBay…"
            />
          </label>
        </div>
        <div className="review-form-row">
          <label>
            Rating
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
              {Object.entries(STAR_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label} star{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="review-form-row full">
          <label>
            Comment
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share your experience with this shop…"
            />
          </label>
        </div>
        {submitError && (
          <p className="review-error">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="review-submit"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </form>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="reviews-message">No reviews yet for “{query}”. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-shop">· {review.shop}</span>
                <span className="review-rating">
                  {"★".repeat(Math.round(review.rating))}
                  {review.rating}
                </span>
                <span className="review-date">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
