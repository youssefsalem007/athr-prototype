import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load server/.env, resolved relative to THIS file so it works whether the
// server runs from server/ (local dev) or is bundled as a Vercel serverless
// function (cwd = project root). dotenv never overrides variables that are
// already present in the environment, so real env vars (e.g. set in the
// Vercel dashboard) always take precedence over the committed .env.
try {
  config({ path: resolve(__dirname, "../../.env") });
} catch (e) {
  // env vars may be set directly by the runtime; .env may not exist
}

export const PORT = process.env.PORT || 4000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

export const FREE_SHIPPING_THRESHOLD = Number(
  process.env.FREE_SHIPPING_THRESHOLD || 1500,
);

export const configService = {
  get: (key) => process.env[key],
};
