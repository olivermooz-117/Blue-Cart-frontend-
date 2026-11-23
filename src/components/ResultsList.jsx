import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import Alert from "../components/Alert";
import ProductCard from "./ProductCard";
import "../styles/search.css";
import "../styles/layout.css";

const KNOWN_SHOPS = ["Amazon", "AliExpress", "eBay"];

const SORTERS = {
  best: { label: "Best match", compare: (a, b) => b.mb_score - a.mb_score },
  price_asc: { label: "Price: Low to High", compare: (a, b) => a.price - b.price },
  price_desc: { label: "Price: High to Low", compare: (a, b) => b.price - a.price },
  rating_desc: { label: "Rating: High to Low", compare: (a, b) => b.rating - a.rating },
  value: { label: "Best value (CB)", compare: (a, b) => b.cb_score - a.cb_score },
};

export default function ResultsList() {
  const { results, status, query, sites, error } = useSelector((state) => state.search);
  const [sortKey, setSortKey] = useState("best");

  const availableSites = useMemo(() => {
    if (sites && sites.length > 0) {
      return sites;
    }
    return [...new Set(results.map((listing) => listing.site))];
  }, [sites, results]);

  const unavailableSites = useMemo(() => {
    return KNOWN_SHOPS.filter((shop) => !availableSites.includes(shop));
  }, [availableSites]);

  const sortedResults = useMemo(
    () => [...results].sort(SORTERS[sortKey].compare),
    [results, sortKey]
  );

  if (status === "loading") {
    return (
      <div className="results-panel">
        <div className="skeleton-text wide" />
        <div className="skeleton-text narrow" />
        <div className="skeleton-text wide" />
        <div className="skeleton-text narrow" />
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="results-panel">
        <Alert type="error">
          Search couldn&rsquo;t complete right now. Please try again in a moment.
          {error ? ` ${error}` : ""}
        </Alert>
      </div>
    );
  }
  if (status === "succeeded" && results.length === 0) {
    return (
      <div className="results-panel">
        <Alert type="info">
          No results for <strong>"{query}"</strong>. Try another keyword.
        </Alert>
      </div>
    );
  }
  if (status === "idle") {
    return (
      <p className="results-message">
        Search for a product to compare e-shops.
      </p>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <span className="results-count">
          {results.length} result{results.length === 1 ? "" : "s"}
        </span>
        <div className="results-shops">
          {availableSites.map((site) => (
            <span key={site} className="results-shop-chip">{site}</span>
          ))}
        </div>
        <label className="results-sort">
          Sort by
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
            {Object.entries(SORTERS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {unavailableSites.length > 0 && (
        <Alert type="warn">
          {unavailableSites.join(", ")} returned nothing for this search.
        </Alert>
      )}
      <div className="results-list">
        {sortedResults.map((listing, index) => (
          <ProductCard
            key={`${listing.site}-${listing.url ?? index}`}
            listing={listing}
            style={{ animationDelay: `${index * 0.06}s` }}
          />
        ))}
      </div>
    </div>
  );
}
