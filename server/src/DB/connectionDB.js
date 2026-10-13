import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { categories, products, sets } from "./seed.js";

// A tiny JSON-file store. On first run it seeds itself from seed.js and
// writes athr-db.json. All data access goes through the repository layer,
// so a real database (e.g. Mongoose) can replace this file later.
//
// Paths are resolved relative to THIS file so the store works whether the
// server runs from server/ (local dev) or is bundled as a Vercel serverless
// function (cwd = project root). Vercel's filesystem is read-only outside
// /tmp, so there the store lives in /tmp and is re-seeded on cold start.

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_DIR = process.env.VERCEL ? "/tmp" : resolve(__dirname, "../../data");
const DB_PATH = resolve(DATA_DIR, "athr-db.json");

const load = () => {
  if (existsSync(DB_PATH)) {
    try {
      return JSON.parse(readFileSync(DB_PATH, "utf8"));
    } catch (e) {
      console.error("[DB] Failed to parse db.json, reseeding:", e.message);
    }
  }
  return seed();
};

const seed = () => {
  const data = { categories, products, sets, orders: [] };
  persist(data);
  console.log("[DB] Seeded data/db.json");
  return data;
};

const persist = (data) => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// In-memory working copy, flushed to disk on every write.
let db = load();

export const store = {
  read: () => db,
  save: () => persist(db),
  reset: () => {
    db = seed();
  },
};

// `model` objects below behave like the collection handles the repository
// expects (a `collectionName` + optional helpers), mirroring how Mongoose
// models are passed into base.repository in rock-diet-backend.
