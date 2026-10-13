import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 7h12l1 13H5L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

export default function Header() {
  const { lang } = useLang();
  const t = useT(lang);
  const { count, openCart } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/shop", label: t.nav.shop },
    { to: "/shop?category=him", label: t.nav.him },
    { to: "/shop?category=her", label: t.nav.her },
    { to: "/shop?category=unisex", label: t.nav.unisex },
    { to: "/orders", label: t.nav.orders },
  ];

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu */}
          <button
            className="lg:hidden text-cream/80 hover:text-light-gold"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <MenuIcon />
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0" aria-label="ATHR home">
            <Logo compact />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm tracking-wider">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `uppercase transition-colors ${
                    isActive
                      ? "text-light-gold"
                      : "text-cream/70 hover:text-light-gold"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="text-cream/80 hover:text-light-gold transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <button
              onClick={openCart}
              className="relative text-cream/80 hover:text-light-gold transition-colors"
              aria-label="Cart"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink text-[0.65rem] font-semibold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <form onSubmit={submitSearch} className="pb-4 flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="flex-1 bg-surface border border-gold/25 rounded px-4 py-2 text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="btn-gold px-5 py-2 rounded text-sm font-medium">
              {t.searchBtn}
            </button>
          </form>
        )}
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gold/20 bg-ink/95">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `uppercase tracking-wider text-sm ${
                    isActive ? "text-light-gold" : "text-cream/70"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 sm:hidden">
              <LanguageToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
