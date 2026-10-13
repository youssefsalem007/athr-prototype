import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";
import { useConfig } from "../lib/config.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

export default function CartDrawer() {
  const { lang } = useLang();
  const t = useT(lang);
  const { freeShippingThreshold } = useConfig();
  const {
    items,
    subtotal,
    isOpen,
    closeCart,
    setQty,
    removeItem,
  } = useCart();

  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />
      {/* drawer */}
      <aside className="w-full sm:w-[420px] bg-surface border-s border-gold/25 flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
          <h2 className="font-display text-2xl text-cream">{t.cart.title}</h2>
          <button
            onClick={closeCart}
            className="text-cream/60 hover:text-light-gold text-2xl leading-none"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* free shipping progress */}
        <div className="px-6 py-4 border-b border-gold/10">
          <p className="text-xs text-cream/60 mb-2">
            {remaining > 0 ? (
              <>
                {fmt(remaining)} {t.product.egp} {t.cart.freeAt}
              </>
            ) : (
              <span className="text-light-gold">{t.cart.freeUnlocked} ✦</span>
            )}
          </p>
          <div className="h-1.5 rounded-full bg-ink overflow-hidden">
            <div
              className="h-full bg-gold-gradient transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-cream/50 mb-6">{t.cart.empty}</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="btn-outline-gold px-6 py-2 rounded text-sm"
              >
                {t.cart.continue}
              </Link>
            </div>
          )}

          {items.map((l) => (
            <div key={`${l.productId}-${l.size}`} className="flex gap-4">
              <div
                className="w-16 h-20 rounded shrink-0 border border-gold/20 overflow-hidden"
                style={{ background: l.gradient || "#0A0A0A" }}
              >
                {l.image && (
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-display text-lg text-cream">{l.name}</h4>
                  <button
                    onClick={() => removeItem(l.productId, l.size)}
                    className="text-cream/40 hover:text-light-gold text-xs"
                  >
                    {t.cart.remove}
                  </button>
                </div>
                <p className="text-cream/50 text-xs">{l.size}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gold/25 rounded">
                    <button
                      onClick={() => setQty(l.productId, l.size, l.qty - 1)}
                      className="px-2.5 py-1 text-cream/70 hover:text-light-gold"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm text-cream">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.productId, l.size, l.qty + 1)}
                      className="px-2.5 py-1 text-cream/70 hover:text-light-gold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-light-gold">
                    {fmt(l.priceEGP * l.qty)} {t.product.egp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gold/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-cream/70">{t.cart.subtotal}</span>
              <span className="font-display text-xl text-light-gold">
                {fmt(subtotal)} {t.product.egp}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block text-center btn-gold py-3 rounded font-medium tracking-wider uppercase text-sm"
            >
              {t.cart.checkout}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
