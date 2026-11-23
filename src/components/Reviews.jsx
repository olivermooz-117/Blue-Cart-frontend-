import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "../components/Alert";
import { fetchReviews, submitReview } from "../store/reviewsSlice";
import { getErrorMessage } from "../api/client";
import "../styles/search.css";

function StarRating({ rating, size = 1.1 }) {
  const full = Math.round(rating);
  return (
    <div className="star-rating" aria-label={`Rating: ${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star ${n <= full ? "star--filled" : ""}`}
          style={{ fontSize: `${size}rem` }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Confetti({ count = 30, start = false }) {
  const [burst, setBurst] = useState(start);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setBurst(false), 900);
    return () => clearTimeout(t);
  }, [start]);
  if (!burst) return null;
  return (
    <div className="confetti">
      {Array.from({ length: count }).map((_, i) => {
        const color = [
          varColor("--color-blue"),
          varColor("--color-mint"),
          varColor("--color-amber"),
          varColor("--color-teal"),
        ][i % 4];
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${20 + (i % 10) * 6}%`,
              top: `${10 + (i % 6) * 8}%`,
              backgroundColor: color,
              animationDelay: `${i * 0.04}s`,
              animationDuration: `${0.7 + (i % 5) * 0.1}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function varColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#3b7597";
}

export default function Reviews({ query }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.email);
  const reviewsState = useSelector((state) => state.reviews.byQuery[query] || {
    reviews: [],
    status: "idle",
    error: null,
  });
  const { reviews, status, error: reviewsError } = reviewsState;

  const [author, setAuthor] = useState(email ? email.split("@")[0] : "");
  const [shop, setShop] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  // Fetch reviews whenever the query changes.
  useEffect(() => {
    if (query) {
      dispatch(fetchReviews({ query }));
    }
  }, [query, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim() || !shop.trim() || !author.trim()) {
      setSubmitError("Author, shop and comment are required.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await dispatch(
        submitReview({
          query,
          shop: shop.trim(),
          author: author.trim(),
          comment: comment.trim(),
          rating: Number(rating),
        })
      ).unwrap();
      setShop("");
      setComment("");
      setRating(5);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 900);
    } catch (err) {
      setSubmitError(
        typeof err === "string" ? err : getErrorMessage(err, "Failed to submit review. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews-panel">
      {celebrate && <Confetti count={24} start={celebrate} />}
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
          <label className="star-label">
            Rating
            <div className="star-picker" role="radiogroup" aria-label="Rating">
              {[5, 4, 3, 2, 1].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={`star-btn ${n <= rating ? "star-btn--active" : ""}`}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={n <= rating}
                >
                  ★
                </button>
              ))}
            </div>
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
        {status === "loading" ? (
          <p className="reviews-message">Loading reviews…</p>
        ) : status === "failed" ? (
          <Alert type="error">
            Reviews couldn&rsquo;t load right now: {reviewsError}
          </Alert>
        ) : reviews.length === 0 ? (
          <p className="reviews-message">No reviews yet for “{query}”. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card animate-slide-up">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-shop">· {review.shop}</span>
                <StarRating rating={review.rating} size={0.9} />
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
