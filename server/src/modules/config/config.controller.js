import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import { FREE_SHIPPING_THRESHOLD } from "../../config/config.service.js";

// Exposes server-side config the client needs (e.g. free-shipping threshold)
// so the announcement bar and cart progress bar match the server's shipping.
const configRouter = Router();

configRouter.get("/", (req, res) => {
  return successResponse({
    res,
    data: { freeShippingThreshold: FREE_SHIPPING_THRESHOLD },
  });
});

export default configRouter;
