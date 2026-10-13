import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

export default function NotFound() {
  const { lang } = useLang();
  const t = useT(lang);

  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <h1 className="font-display text-6xl text-gold-gradient mb-4">404</h1>
      <p className="text-cream/55 mb-8">{t.shop.empty}</p>
      <Link to="/" className="btn-gold px-8 py-3 rounded text-sm tracking-wider uppercase">
        {t.nav.home}
      </Link>
    </div>
  );
}
