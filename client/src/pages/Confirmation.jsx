import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

export default function Confirmation() {
  const { lang } = useLang();
  const t = useT(lang);
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="text-light-gold text-5xl mb-6 animate-fade-up">✦</div>
      <h1 className="font-display text-4xl text-cream mb-3">
        {t.confirmation.title}
      </h1>
      <p className="text-cream/55 mb-8">{t.confirmation.body}</p>

      {order && (
        <div className="surface-card rounded-lg p-6 text-start mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-cream/50">{t.confirmation.orderId}</span>
            <span className="text-light-gold font-mono">{order._id}</span>
          </div>
          <div className="hairline my-3" />
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm text-cream/70 py-1">
              <span>{it.name} · {it.size} × {it.qty}</span>
              <span>{fmt(it.lineTotal)} {t.product.egp}</span>
            </div>
          ))}
          <div className="hairline my-3" />
          <div className="flex justify-between text-sm text-cream/60">
            <span>{t.checkout.shipping}</span>
            <span>{order.shipping === 0 ? t.checkout.free : `${fmt(order.shipping)} ${t.product.egp}`}</span>
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-cream">{t.checkout.total}</span>
            <span className="font-display text-2xl text-light-gold">
              {fmt(order.total)} {t.product.egp}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/orders" className="btn-outline-gold px-6 py-3 rounded text-sm tracking-wider uppercase">
          {t.confirmation.viewOrders}
        </Link>
        <Link to="/shop" className="btn-gold px-6 py-3 rounded text-sm tracking-wider uppercase">
          {t.confirmation.continue}
        </Link>
      </div>
    </div>
  );
}
