function StarRating({ rating, count, size = "md" }) {
  const safeRating = Math.max(0, Math.min(5, parseFloat(rating) || 0));
  const safeCount = Number.isFinite(count) ? count : 0;

  return (
    <div className={`star-rating star-rating-${size}`}>
      <span className="star-rating-stars">
        {[1, 2, 3, 4, 5].map((n) => {
          const fillPct = Math.max(
            0,
            Math.min(1, safeRating - (n - 1))
          ) * 100;

          return (
            <span key={n} className="star-rating-star">
              <span className="star-rating-star-track">★</span>
              <span
                className="star-rating-star-fill"
                style={{ width: `${fillPct}%` }}
              >
                ★
              </span>
            </span>
          );
        })}
      </span>

      <span className="star-rating-value">{safeRating.toFixed(1)}</span>

      {safeCount > 0 && (
        <span className="star-rating-count">
          ({safeCount} {safeCount === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  );
}

export default StarRating;