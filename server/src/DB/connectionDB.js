import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { categories, products, sets } from "./seed.js";

// A tiny JSON-file store. On first run it seeds itself from seed.js and
// writes data/db.json. All data access goes through the repository layer,
// so a real database (e.g. Mongoose) can replace this file later.

const DB_PATH = resolve("./data/db.json");

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
  const dir = resolve("./data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
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
