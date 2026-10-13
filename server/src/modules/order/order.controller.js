import { Router } from "express";
import * as orderService from "./order.service.js";
import { successResponse } from "../../common/utils/success.response.js";
import { validation } from "../../common/middleware/validation.js";
import { createOrderSchema } from "./order.validation.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  validation(createOrderSchema),
  async (req, res) => {
    const { name, phone, address, items } = req.body;

    const order = await orderService.createOrder({
      name,
      phone,
      address,
      items,
    });

    return successResponse({
      res,
      status: 201,
      message: "Order placed",
      data: order,
    });
  },
);

orderRouter.get("/", async (req, res) => {
  const orders = await orderService.getOrders();
  return successResponse({ res, data: orders });
});

export default orderRouter;
