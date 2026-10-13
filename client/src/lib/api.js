// API base comes from an env variable. Empty -> use relative /api (Vite proxy).
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    // non-JSON response
  }

  if (!res.ok) {
    const message =
      (json && (json.message || json.error)) ||
      `Request failed (${res.status})`;
    const err = new Error(
      Array.isArray(message) ? message.map((e) => e.message).join(", ") : message,
    );
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

export const api = {
  getConfig: () => request("/config"),
  getProducts: ({ category, q, sort } = {}) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),
  getCategories: () => request("/categories"),
  getSets: () => request("/sets"),
  createOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  getOrders: () => request("/orders"),
};

export const unwrap = (json) => (json ? json.data : json);
