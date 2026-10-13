import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, unwrap } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

export default function Shop() {
  const { lang } = useLang();
  const t = useT(lang);
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "";

  const [search, setSearch] = useState(q);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .getProducts({ category, q, sort })
      .then((json) => alive && setProducts(unwrap(json)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [category, q, sort]);

  useEffect(() => {
    api
      .getCategories()
      .then((json) => setCategories(unwrap(json)))
      .catch(() => {});
  }, []);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    update("q", search.trim());
  };

  const catOptions = [
    { id: "", name: t.shop.all },
    ...categories.map((c) => ({ id: c.id, name: c.name, nameAr: c.nameAr })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl text-cream">
          {t.shop.title}
        </h1>
        <div className="hairline w-24 mx-auto mt-4" />
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-10">
        {/* category filter */}
        <div className="flex flex-wrap gap-2">
          {catOptions.map((c) => (
            <button
              key={c.id || "all"}
              onClick={() => update("category", c.id)}
              className={`px-4 py-2 rounded text-sm tracking-wider uppercase border transition-colors ${
                category === c.id
                  ? "bg-gold text-ink border-gold"
                  : "border-gold/30 text-cream/70 hover:border-gold hover:text-light-gold"
              }`}
            >
              {c.name}
              {lang === "ar" && c.nameAr ? ` · ${c.nameAr}` : ""}
            </button>
          ))}
        </div>

        {/* search + sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={submitSearch} className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="bg-surface border border-gold/25 rounded-s px-4 py-2 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-gold w-full sm:w-56"
            />
            <button type="submit" className="btn-gold px-4 py-2 rounded-e text-sm">
              {t.searchBtn}
            </button>
          </form>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className="bg-surface border border-gold/25 rounded px-4 py-2 text-sm text-cream focus:outline-none focus:border-gold"
          >
            <option value="">{t.shop.sort}</option>
            <option value="new">{t.shop.sortNew}</option>
            <option value="best">{t.shop.sortBest}</option>
            <option value="price_asc">{t.shop.priceAsc}</option>
            <option value="price_desc">{t.shop.priceDesc}</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-cream/40 py-20">{t.search}…</p>
      ) : products.length === 0 ? (
        <p className="text-center text-cream/50 py-20">{t.shop.empty}</p>
      ) : (
        <>
          <p className="text-cream/40 text-sm mb-6">
            {products.length} {t.shop.results}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} t={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
