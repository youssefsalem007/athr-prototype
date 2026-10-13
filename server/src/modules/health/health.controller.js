import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  return successResponse({
    res,
    message: "ATHR API is healthy",
    data: { status: "ok", uptime: process.uptime() },
  });
});

export default healthRouter;
