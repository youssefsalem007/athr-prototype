import { config } from "dotenv";
import { resolve } from "node:path";

try {
  config({ path: resolve(`./.env.${process.env.NODE_ENV || "development"}`) });
} catch (e) {
  // env vars may be set directly by the runtime; .env files may not exist
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
