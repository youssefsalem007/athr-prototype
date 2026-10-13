import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PORT, ALLOWED_ORIGINS, NODE_ENV } from "./config/config.service.js";
import { apiRateLimiter } from "./common/middleware/rateLimiter.js";
import healthRouter from "./modules/health/health.controller.js";
import configRouter from "./modules/config/config.controller.js";
import productRouter from "./modules/product/product.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import setRouter from "./modules/set/set.controller.js";
import orderRouter from "./modules/order/order.controller.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to ATHR API" });
});

app.use("/api/health", healthRouter);
app.use("/api/config", configRouter);
app.use("/api/products", apiRateLimiter, productRouter);
app.use("/api/categories", apiRateLimiter, categoryRouter);
app.use("/api/sets", apiRateLimiter, setRouter);
app.use("/api/orders", apiRateLimiter, orderRouter);

// 404 — mirrors rock-diet-backend route-not-found shape.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — mirrors rock-diet-backend (err.cause || 500).
app.use((err, req, res, next) => {
  const status = err.cause || 500;
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  const message =
    NODE_ENV === "production" ? "Internal server error" : err.message;
  res.status(status).json({ message });
});

const bootstrap = () => {
  app.listen(PORT, () => {
    console.log(`ATHR API running on port ${PORT}`);
  });
};

export { app };
export default bootstrap;
