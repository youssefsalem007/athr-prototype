# ATHR · أثر — Luxury Fragrance Storefront Prototype

A working prototype of an e-commerce storefront for **ATHR (أثر)**, a luxury
fragrance brand. Black-marble-and-gold aesthetic, a real brand lockup, and real
fragrance photography — all assets are bundled locally (no external image URLs).

> Prototype scope: single-user, **no auth, no roles, no payments** (Cash on
> Delivery only). All product names/descriptions are **original placeholders** —
> no real perfume brands are referenced anywhere.

---

## 1. Quick start

Requires **Node 18+**.

```bash
# from the project root (athr-prototype/)
npm run dev
```

That single command starts **both** the API server and the Vite dev client via
`concurrently`, and wires the Vite proxy so the browser calls `/api/*`.

- Client (Vite): http://localhost:5173
- API (Express): http://localhost:4000/api

The client reads its API base from an env variable (`VITE_API_BASE_URL`). It
defaults to `/api`, which the Vite dev proxy forwards to the server. See
`client/.env.example`.

The server auto-seeds a JSON-file store on first run. Delete
`server/data/db.json` to reset it to the seed data.

---

## 2. Scripts

Run from the **project root**:

| Command | What it does |
|---|---|
| `npm run dev` | Starts server **and** client together (concurrently) |
| `npm run dev:server` | Runs only the Express API (with `--watch`) |
| `npm run dev:client` | Runs only the Vite dev server |
| `npm run build` | Builds the client for production into `client/dist/` |
| `npm run preview` | Serves the production build of the client |
| `npm start` | Runs the server in production mode (also serves `client/dist`) |

Run from **`client/`**: `npm run dev`, `npm run build`, `npm run preview`.

---

## 3. Folder structure

```
athr-prototype/
├─ package.json            # root — concurrently + one-command dev
├─ .gitignore
├─ README.md
│
├─ server/                 # Express API
│  ├─ .env.example
│  ├─ package.json
│  ├─ data/
│  │  └─ db.json          # JSON-file store (auto-created / seeded)
│  └─ src/
│     ├─ index.js         # entry: boots app + starts listening
│     ├─ app.bootstrap.js # wires express, cors, rate limit, routes, error handler
│     ├─ config/
│     │  └─ config.service.js   # env access (PORT, CORS_ORIGIN, DATA_FILE…)
│     ├─ common/
│     │  ├─ utils/success.response.js   # { success, data, message } envelope
│     │  └─ middleware/
│     │     ├─ validation.js            # simple field validators
│     │     └─ rateLimiter.js           # express-rate-limit
│     ├─ DB/
│     │  ├─ connectionDB.js             # loads/saves the JSON store
│     │  ├─ seed.js                     # 12 products + 2 sets + categories
│     │  ├─ model/                      # product, category, set, order models
│     │  └─ repository/
│     │        └─ base.repository.js    # generic JSON repo (swap for a real DB)
│     └─ modules/                       # feature modules (controller/service/validation)
│        ├─ product/    category/    set/    order/    health/    config/
│
└─ client/                 # React + Vite + Tailwind
   ├─ .env.example
   ├─ index.html           # loads Google Fonts (Cormorant/Cinzel, Amiri)
   ├─ tailwind.config.js   # brand design tokens (gold, ink, marble…)
   ├─ postcss.config.js
   ├─ vite.config.js       # /api proxy → http://localhost:4000
   └─ src/
      ├─ main.jsx          # React root + Router + Cart + Lang providers
      ├─ App.jsx           # routes + announcement bar/header/footer/cart
      ├─ index.css         # Tailwind layers + brand utilities (.btn-gold, .hairline, .bg-marble…)
      ├─ lib/
      │  ├─ api.js         # fetch wrapper; API base from VITE_API_BASE_URL
      │  └─ config.js      # reads /api/config (free-shipping threshold…)
      ├─ context/
      │  ├─ CartContext.jsx    # cart state + localStorage
      │  └─ LangContext.jsx    # EN/AR toggle + RTL
      ├─ data/content.js   # EN/AR copy (useT)
      ├─ components/       # Header, Footer, CartDrawer, ProductCard,
      │                    # ProductVisual, Logo, AnnouncementBar, LanguageToggle
      └─ pages/            # Home, Shop, ProductDetail, Checkout,
                           # Confirmation, Orders, NotFound
   └─ public/
      ├─ logo/athr-logo.jpg   # original source mark (runtime logo is the SVG in components/Logo.jsx)
      └─ products/*.jpg       # real fragrance photography (bundled locally)
```

---

## 4. API reference

All routes are under **`/api`**. Every response uses the envelope:

```jsonc
{
  "success": true,
  "message": "...",
  "status": 200,
  "data": { /* payload */ }
}
```

| Method | Path | Query / Body | Description |
|---|---|---|---|
| GET | `/api/health` | — | Liveness probe. |
| GET | `/api/config` | — | Storefront config (e.g. `freeShippingThreshold`). |
| GET | `/api/products` | `category=him\|her\|unisex`, `q`, `sort=price_asc\|price_desc\|new\|best` | List products with optional filter/search/sort. |
| GET | `/api/products/:slug` | — | Single product with `sizes[]`. |
| GET | `/api/categories` | — | Categories with product counts. |
| GET | `/api/sets` | — | Gift/discovery bundles (original, sale, savings). |
| POST | `/api/orders` | body: `{ name, phone, address, items:[{productId, size, qty}] }` | Places an order. **The server recalculates all prices from its own data** and ignores any client-sent amounts. |
| GET | `/api/orders` | — | Saved orders, newest first. |

### Example: place an order

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Layla Hassan",
    "phone": "01001234567",
    "address": "12 Nasr Rd, Cairo",
    "items": [
      { "productId": "1", "size": "30ml", "qty": 2 },
      { "productId": "5", "size": "5ml",  "qty": 1 }
    ]
  }'
```

The response's `data.subtotal` / `data.total` are computed server-side
(e.g. `1850×2 + 360×1 = 4060`), with free shipping applied above the threshold.

### Data model — product

```jsonc
{
  "id": "1", "slug": "oud-ember", "name": "Oud Ember",
  "category": "him",
  "notes": "Smoked oud, dry cedar, a whisper of black pepper.",
  "image": "/products/photo-1541643600914-78b084683601.jpg", // local asset
  "isBestSeller": true, "isNew": false,
  "sizes": [
    { "label": "5ml",  "priceEGP": 350 },
    { "label": "30ml", "priceEGP": 1850 },
    { "label": "50ml", "priceEGP": 2600 }
  ]
}
```

---

## 5. Which rockdiet-backend conventions were mirrored

The server deliberately follows the structure/conventions of the existing
`rock-diet-backend` codebase so the two feel like siblings:

- **Layered feature modules** — `modules/<feature>/{controller,service,validation}.js`,
  mirroring rockdiet's `product` / `order` modules.
- **Controller → service** split: controllers stay thin (parse/respond); all
  logic lives in services.
- **Central response envelope** — the `{ success, message, status, data }`
  shape from `common/utils/success.response.js`, reused as-is. Where rockdiet had
  no clear convention, `{ success, data, message }` is the fallback.
- **Config service** — a `config/config.service.js` reads env the same way.
- **Validation middleware** — field validators under `common/middleware/validation.js`,
  consistent with rockdiet's approach.
- **Rate limiting + CORS middleware** — `common/middleware/rateLimiter.js` and CORS
  in `app.bootstrap.js`.
- **`app.bootstrap.js` + `index.js`** separation, as in rockdiet.
- **Repository layer** — rockdiet uses a base repository over a DB; here a
  `DB/repository/base.repository.js` sits over a JSON file so a real database
  can drop in behind the same interface later.

**Deviations (intentional):** plain **JavaScript** (no TypeScript) and a
JSON-file store (not MongoDB), per the prototype constraints.

---

## 6. Design tokens

Defined in `client/tailwind.config.js` so they're easy to tweak:

| Token | Value | Use |
|---|---|---|
| `ink` | `#0A0A0A` | near-black background |
| `surface` | `#141414` | cards / raised surfaces |
| `gold` | `#C9A24B` | primary accent |
| `light-gold` | `#E8C872` | highlights, prices |
| `bronze` | `#8A6A2A` | gradient depth |
| `cream` | `#F5F1E8` | off-white text |
| fonts | Cormorant Garamond / Cinzel (display), body sans, **Amiri** (Arabic) | loaded from Google Fonts in `index.html` |

Extras: gold hairline dividers (`.hairline`), gold gradient buttons
(`.btn-gold`, `text-gold-gradient`), and a CSS-only black marble background
(`.bg-marble`).

---

## 7. Language toggle

The header includes an **EN / AR** toggle (`LanguageToggle` + `LangContext`).
Switching to Arabic flips the document to **RTL** and swaps UI copy via
`data/content.js` (`useT`). Product/category names include Arabic variants.

---

## 8. Notes & limitations

- Single-user prototype: no authentication or roles.
- Payment is out of scope — checkout collects name/phone/address and stores a
  "confirmed" COD order.
- Persistence is a JSON file; the repository layer makes it swappable for a real DB.
- Product images and the logo are committed under `client/public/` — no runtime
  dependency on external hosts.

