import { Router } from "express";
import * as setService from "./set.service.js";
import { successResponse } from "../../common/utils/success.response.js";

const setRouter = Router();

setRouter.get("/", async (req, res) => {
  const sets = await setService.getSets();
  return successResponse({ res, data: sets });
});

export default setRouter;
