import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, unwrap } from "../lib/api.js";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

export default function Orders() {
  const { lang } = useLang();
  const t = useT(lang);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .getOrders()
      .then((json) => alive && setOrders(unwrap(json)))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl text-cream">{t.orders.title}</h1>
        <div className="hairline w-24 mx-auto mt-4" />
      </div>

      {loading ? (
        <p className="text-center text-cream/40 py-16">{t.search}…</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-cream/50 mb-6">{t.orders.empty}</p>
          <Link to="/shop" className="btn-gold px-8 py-3 rounded text-sm tracking-wider uppercase">
            {t.nav.shop}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o._id} className="surface-card rounded-lg p-6">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <div>
                  <span className="text-cream/40 text-xs tracking-wider uppercase">
                    {t.confirmation.orderId}
                  </span>
                  <p className="text-light-gold font-mono">{o._id}</p>
                </div>
                <div className="text-end">
                  <span className="text-cream/40 text-xs">{t.orders.placedOn}</span>
                  <p className="text-cream/70 text-sm">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-gold/40 text-light-gold">
                  {o.status}
                </span>
              </div>
              <div className="hairline my-3" />
              <div className="space-y-1 mb-3">
                {o.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm text-cream/70">
                    <span>{it.name} · {it.size} × {it.qty}</span>
                    <span>{fmt(it.lineTotal)} {t.product.egp}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-cream/50 text-sm">
                  {o.items.length} {t.orders.items} · {o.name}
                </span>
                <span className="font-display text-xl text-light-gold">
                  {fmt(o.total)} {t.product.egp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
