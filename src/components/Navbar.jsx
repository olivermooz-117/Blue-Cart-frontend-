import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../store/authSlice";
import "../styles/navbar.css";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand animate-logo-glow" aria-label="BlueCart home">
          <span className="navbar-brand-mark animate-float">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          BlueCart
        </Link>

        <div className="navbar-search">
          <SearchBar placeholder="Search for your product..." />
        </div>

        <div className="navbar-actions">
          {email && (
            <Link to="/history" className="navbar-link-plain">
              History
            </Link>
          )}
          {email ? (
            <>
              <span className="navbar-user">Hi, {email.split("@")[0]}</span>
              <button
                type="button"
                className="navbar-link focus-ring"
                onClick={() => dispatch(logout())}
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/auth" className="navbar-signin focus-ring">
              Sign In
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
