import { useEffect, useState } from "react";
import { api, unwrap } from "./api.js";

// Loads the free-shipping threshold from the server (GET /api/config) so the
// client matches the server's shipping logic. Falls back to an env var.
const FALLBACK = Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD || 1500);

export function useConfig() {
  const [threshold, setThreshold] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .getConfig()
      .then((json) => {
        if (!alive) return;
        const cfg = unwrap(json);
        if (cfg && typeof cfg.freeShippingThreshold === "number") {
          setThreshold(cfg.freeShippingThreshold);
        }
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  return { freeShippingThreshold: threshold, loaded };
}
