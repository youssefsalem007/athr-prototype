import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

// EN / AR toggle. Switches <html dir> for RTL via LangContext.
export default function LanguageToggle() {
  const { lang, toggle } = useLang();
  const t = useT(lang);

  return (
    <button
      onClick={toggle}
      className="text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-gold/40 text-cream/80 hover:text-light-gold hover:border-gold transition-colors"
      aria-label="Toggle language"
    >
      {t.langToggle}
    </button>
  );
}
