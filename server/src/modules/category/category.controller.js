import { Router } from "express";
import * as categoryService from "./category.service.js";
import { successResponse } from "../../common/utils/success.response.js";

const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
  const categories = await categoryService.getCategories();
  return successResponse({ res, data: categories });
});

export default categoryRouter;
