import { Router } from "express";
import * as productService from "./product.service.js";
import { successResponse } from "../../common/utils/success.response.js";
import { validation } from "../../common/middleware/validation.js";
import {
  productQuerySchema,
  productSlugSchema,
} from "./product.validation.js";

const productRouter = Router();

productRouter.get(
  "/",
  validation(productQuerySchema),
  async (req, res) => {
    const { category, q, sort } = req.query;

    const products = await productService.getProducts({ category, q, sort });

    return successResponse({ res, data: products });
  },
);

productRouter.get(
  "/:slug",
  validation(productSlugSchema),
  async (req, res) => {
    const { slug } = req.params;

    const product = await productService.getProductBySlug(slug);

    return successResponse({ res, data: product });
  },
);

export default productRouter;
