import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useT } from "../data/content.js";
import { useConfig } from "../lib/config.js";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

export default function Checkout() {
  const { lang } = useLang();
  const t = useT(lang);
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { freeShippingThreshold } = useConfig();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const shipping = subtotal >= freeShippingThreshold ? 0 : 65;
  const total = subtotal + shipping;

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t.checkout.name;
    if (form.phone.trim().length < 6) e.phone = t.checkout.phone;
    if (form.address.trim().length < 5) e.address = t.checkout.address;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        items: items.map((l) => ({
          productId: l.productId,
          size: l.size,
          qty: l.qty,
        })),
      };
      const json = await api.createOrder(payload);
      const order = json.data;
      clearCart();
      navigate("/order-confirmed", { state: { order } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-cream mb-4">{t.cart.empty}</h1>
        <Link to="/shop" className="btn-gold px-8 py-3 rounded font-medium tracking-wider uppercase text-sm">
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream text-center mb-12">
        {t.checkout.title}
      </h1>

      <div className="grid md:grid-cols-5 gap-10">
        <form onSubmit={submit} className="md:col-span-3 space-y-6">
          <Field
            label={t.checkout.name}
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            error={errors.name}
          />
          <Field
            label={t.checkout.phone}
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            error={errors.phone}
            type="tel"
          />
          <Field
            label={t.checkout.address}
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            error={errors.address}
            textarea
          />

          {serverError && (
            <p className="text-red-300 text-sm border border-red-400/30 bg-red-500/10 rounded px-4 py-3">
              {serverError}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold px-8 py-3 rounded font-medium tracking-wider uppercase text-sm disabled:opacity-60"
            >
              {submitting ? t.checkout.placing : t.checkout.place}
            </button>
            <Link to="/shop" className="btn-outline-gold px-6 py-3 rounded text-sm">
              {t.cart.continue}
            </Link>
          </div>
        </form>

        <aside className="md:col-span-2 surface-card rounded-lg p-6 h-fit">
          <h2 className="font-display text-2xl text-cream mb-6">
            {t.checkout.summary}
          </h2>
          <div className="space-y-4 mb-6">
            {items.map((l) => (
              <div key={`${l.productId}-${l.size}`} className="flex justify-between text-sm">
                <span className="text-cream/70">
                  {l.name} <span className="text-cream/40">· {l.size} × {l.qty}</span>
                </span>
                <span className="text-cream">
                  {fmt(l.priceEGP * l.qty)} {t.product.egp}
                </span>
              </div>
            ))}
          </div>
          <div className="hairline my-4" />
          <Row label={t.cart.subtotal} value={`${fmt(subtotal)} ${t.product.egp}`} />
          <Row
            label={t.checkout.shipping}
            value={shipping === 0 ? t.checkout.free : `${fmt(shipping)} ${t.product.egp}`}
          />
          <div className="hairline my-4" />
          <div className="flex justify-between items-baseline">
            <span className="text-cream/70">{t.checkout.total}</span>
            <span className="font-display text-2xl text-light-gold">
              {fmt(total)} {t.product.egp}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-cream/60">{label}</span>
      <span className="text-cream">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", textarea = false }) {
  const base =
    "w-full bg-surface border rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none transition-colors";
  const cls = `${base} ${error ? "border-red-400/60" : "border-gold/25 focus:border-gold"}`;
  return (
    <label className="block">
      <span className="block text-light-gold text-xs tracking-[0.25em] uppercase mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {error && <span className="block text-red-300 text-xs mt-1">{error}</span>}
    </label>
  );
}

