import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

export default function ProductCard({ product, t }) {
  const { lang } = useLang();
  const dict = t || useT(lang);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group surface-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-gold flex flex-col"
    >
      <div className="relative">
        <ProductVisual product={product} className="h-64 w-full" />
        <div className="absolute top-3 inset-x-3 flex justify-between">
          {product.isNew && (
            <span className="text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1 rounded bg-gold text-ink font-medium">
              {dict.product.new}
            </span>
          )}
          {product.isBestSeller && (
            <span className="text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1 rounded bg-ink/70 border border-gold/40 text-light-gold ms-auto">
              {dict.product.bestSeller}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-xl text-cream group-hover:text-light-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-cream/50 text-sm mt-1 line-clamp-2">{product.notes}</p>
        <div className="mt-auto pt-3 flex items-baseline justify-between">
          <span className="text-cream/40 text-xs tracking-wider uppercase">
            {dict.product.from}
          </span>
          <span className="text-light-gold font-display text-lg">
            {fmt(product.startingPrice ?? Math.min(...product.sizes.map((s) => s.priceEGP)))}{" "}
            <span className="text-xs text-cream/50">{dict.product.egp}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
