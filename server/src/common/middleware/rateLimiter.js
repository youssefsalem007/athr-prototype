import rateLimit from "express-rate-limit";

// Mirrors rock-diet-backend apiRateLimiter (single-user prototype: no auth limiter needed).
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});
