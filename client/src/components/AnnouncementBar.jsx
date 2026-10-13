import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

// Top announcement bar with a free-shipping message over a configurable
// threshold. Marquee animation, gold on near-black.
export default function AnnouncementBar({ threshold }) {
  const { lang } = useLang();
  const t = useT(lang);

  const message = `${t.announcement} ${fmt(threshold)} ${t.product.egp}   ✦   ${t.tagline}   ✦   ${t.announcement} ${fmt(threshold)} ${t.product.egp}   ✦`;

  return (
    <div className="bg-gradient-to-r from-bronze/30 via-gold/20 to-bronze/30 border-b border-gold/20 overflow-hidden">
      <div className="marquee-track py-2 text-[0.7rem] sm:text-xs tracking-[0.25em] uppercase text-light-gold/90">
        <span className="px-6">{message}</span>
        <span className="px-6">{message}</span>
      </div>
    </div>
  );
}
