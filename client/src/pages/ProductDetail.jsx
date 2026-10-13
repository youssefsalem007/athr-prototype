import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, unwrap } from "../lib/api.js";
import ProductVisual from "../components/ProductVisual.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

export default function ProductDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const t = useT(lang);
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setAdded(false);
    setSizeIdx(0);
    api
      .getProduct(slug)
      .then((json) => alive && setProduct(unwrap(json)))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return <p className="text-center text-cream/40 py-32">{t.search}…</p>;
  }
  if (error || !product) {
    return (
      <div className="text-center py-32">
        <p className="text-cream/60 mb-6">{error || t.shop.empty}</p>
        <Link to="/shop" className="btn-outline-gold px-6 py-2 rounded text-sm">
          {t.nav.shop}
        </Link>
      </div>
    );
  }

  const size = product.sizes[sizeIdx];

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: size.label,
      priceEGP: size.priceEGP,
      qty: 1,
      gradient: product.gradient,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Visual */}
        <div className="surface-card rounded-xl overflow-hidden">
          <ProductVisual product={product} className="h-[480px] w-full" />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex gap-2 mb-4">
            {product.isNew && (
              <span className="text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1 rounded bg-gold text-ink">
                {t.product.new}
              </span>
            )}
            {product.isBestSeller && (
              <span className="text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1 rounded border border-gold/40 text-light-gold">
                {t.product.bestSeller}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cream">
            {product.name}
          </h1>
          <p className="text-cream/55 mt-4 text-lg">{product.notes}</p>

          <div className="hairline my-8" />

          {/* Size selector */}
          <label className="text-light-gold text-xs tracking-[0.25em] uppercase mb-3">
            {t.product.selectSize}
          </label>
          <div className="flex gap-3 mb-8">
            {product.sizes.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSizeIdx(i)}
                className={`px-5 py-3 rounded border text-center transition-colors ${
                  i === sizeIdx
                    ? "border-gold bg-gold/10 text-light-gold"
                    : "border-gold/25 text-cream/70 hover:border-gold"
                }`}
              >
                <span className="block text-sm">{s.label}</span>
                <span className="block text-xs text-cream/50 mt-1">
                  {fmt(s.priceEGP)} {t.product.egp}
                </span>
              </button>
            ))}
          </div>

          {/* Price + add */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-3xl text-light-gold">
              {fmt(size.priceEGP)} {t.product.egp}
            </span>
          </div>

          <button onClick={handleAdd} className="btn-gold py-4 rounded font-medium tracking-wider uppercase text-sm">
            {t.product.addToCart}
          </button>

          {added && (
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="text-light-gold">{t.product.added} ✦</span>
              <button onClick={openCart} className="text-cream/60 hover:text-light-gold underline">
                {t.cart.title}
              </button>
            </div>
          )}

          <div className="hairline my-8" />
          <p className="text-cream/40 text-xs tracking-[0.2em] uppercase">
            {t.trust[1].title} · {t.trust[3].title}
          </p>
        </div>
      </div>
    </div>
  );
}
