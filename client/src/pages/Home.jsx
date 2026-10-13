import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, unwrap } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Logo from "../components/Logo.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

function SectionTitle({ title }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="font-display text-3xl md:text-4xl text-cream">{title}</h2>
      <div className="hairline w-24 mx-auto mt-4" />
    </div>
  );
}

function TrustStrip({ t }) {
  const icons = ["✦", "❖", "✧", "◈"];
  return (
    <section className="border-y border-gold/15 bg-ink/40">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {t.trust.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2">
            <span className="text-light-gold text-2xl">{icons[i]}</span>
            <h4 className="font-display text-lg text-cream">{item.title}</h4>
            <p className="text-cream/45 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { lang } = useLang();
  const t = useT(lang);
  const [best, setBest] = useState([]);
  const [fresh, setFresh] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.getProducts({ sort: "best" }),
      api.getProducts({ sort: "new" }),
      api.getCategories(),
      api.getSets(),
    ])
      .then(([b, n, c, s]) => {
        if (!alive) return;
        setBest(unwrap(b).slice(0, 4));
        setFresh(unwrap(n).slice(0, 4));
        setCategories(unwrap(c));
        setSets(unwrap(s));
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const featuredSet = sets[0];

  return (
    <div>
      {/* HERO — marble & gold */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-marble opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36 flex flex-col items-center text-center">
          <span className="text-light-gold/80 text-xs tracking-[0.4em] uppercase mb-6 animate-fade-up">
            {t.hero.kicker}
          </span>
          <div className="animate-fade-up mb-8">
            <Logo />
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-cream max-w-3xl leading-tight animate-fade-up">
            {t.hero.title}
          </h1>
          <p className="mt-6 text-cream/60 max-w-xl animate-fade-up">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up">
            <Link to="/shop" className="btn-gold px-8 py-3 rounded font-medium tracking-wider uppercase text-sm">
              {t.hero.cta}
            </Link>
            <a href="#sets" className="btn-outline-gold px-8 py-3 rounded font-medium tracking-wider uppercase text-sm">
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </section>

      <TrustStrip t={t} />

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionTitle title={t.sections.bestSellers} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} t={t} />
          ))}
        </div>
      </section>

      {/* FEATURED GIFT SET */}
      {featuredSet && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <SectionTitle title={t.sections.featured} />
          <div className="surface-card rounded-xl overflow-hidden grid md:grid-cols-2">
            <ProductVisual product={featuredSet} className="h-72 md:h-full min-h-[320px]" />
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-light-gold text-xs tracking-[0.3em] uppercase">
                {t.sections.sets}
              </span>
              <h3 className="font-display text-3xl md:text-4xl text-cream mt-3">
                {featuredSet.name}
              </h3>
              <p className="text-cream/55 mt-3">{featuredSet.notes}</p>
              <div className="mt-6 flex items-baseline gap-4 flex-wrap">
                <span className="text-light-gold font-display text-3xl">
                  {fmt(featuredSet.salePrice)} {t.product.egp}
                </span>
                <span className="text-cream/35 line-through">
                  {fmt(featuredSet.originalPrice)}
                </span>
                <span className="text-gold text-sm">
                  −{fmt(featuredSet.savings)} {t.product.egp}
                </span>
              </div>
              <Link
                to="/shop"
                className="mt-8 btn-gold px-8 py-3 rounded font-medium tracking-wider uppercase text-sm self-start"
              >
                {t.hero.cta2}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY TILES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionTitle title={t.sections.categories} />
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.id}`}
              className="group relative h-56 rounded-lg overflow-hidden surface-card flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1"
            >
              <span className="font-display text-3xl text-cream group-hover:text-light-gold transition-colors">
                {c.name}
              </span>
              {lang === "ar" && (
                <span className="font-arabic text-light-gold/70">{c.nameAr}</span>
              )}
              <span className="text-cream/40 text-xs tracking-[0.2em] uppercase">
                {c.tagline}
              </span>
              <span className="mt-2 text-gold text-xs">
                {c.productCount} {t.shop.results}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section id="sets" className="max-w-7xl mx-auto px-6 pb-24">
        <SectionTitle title={t.sections.newArrivals} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} t={t} />
          ))}
        </div>
      </section>

      {loading && (
        <p className="text-center text-cream/40 pb-16">{t.search}…</p>
      )}

    </div>
  );
}
