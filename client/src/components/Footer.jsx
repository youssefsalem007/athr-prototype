import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

export default function Footer() {
  const { lang } = useLang();
  const t = useT(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-3 items-start">
        {/* Brand lockup */}
        <div className="flex flex-col items-center md:items-start">
          <Logo />
          <p className="mt-4 text-center md:text-start text-cream/40 text-xs tracking-[0.2em] uppercase">
            {t.tagline}
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-col items-center md:items-start gap-3 text-sm">
          <h4 className="text-light-gold tracking-[0.2em] uppercase text-xs mb-2">
            {t.nav.shop}
          </h4>
          <Link to="/shop?category=him" className="text-cream/60 hover:text-light-gold">
            {t.nav.him}
          </Link>
          <Link to="/shop?category=her" className="text-cream/60 hover:text-light-gold">
            {t.nav.her}
          </Link>
          <Link to="/shop?category=unisex" className="text-cream/60 hover:text-light-gold">
            {t.nav.unisex}
          </Link>
          <Link to="/shop?sort=new" className="text-cream/60 hover:text-light-gold">
            {t.sections.newArrivals}
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center md:items-start gap-3 text-sm">
          <h4 className="text-light-gold tracking-[0.2em] uppercase text-xs mb-2">
            ATHR
          </h4>
          <Link to="/orders" className="text-cream/60 hover:text-light-gold">
            {t.nav.orders}
          </Link>
          <Link to="/shop" className="text-cream/60 hover:text-light-gold">
            {t.nav.shop}
          </Link>
          <span className="text-cream/30">Cash on Delivery</span>
        </div>
      </div>

      <div className="hairline" />
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/40">
        <span>© {year} ATHR · أثر Fragrances</span>
        <span className="tracking-[0.2em] uppercase">{t.tagline}</span>
      </div>
    </footer>
  );
}
