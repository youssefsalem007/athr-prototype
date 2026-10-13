import Joi from "joi";

const orderItemSchema = Joi.object({
  productId: Joi.string().trim().min(1).max(60).required(),
  size: Joi.string().valid("5ml", "30ml", "50ml").required(),
  qty: Joi.number().integer().min(1).max(99).required(),
});

export const createOrderSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.min": "Name is too short",
      "any.required": "Name is required",
    }),
    phone: Joi.string().trim().min(6).max(20).required().messages({
      "string.min": "Phone number is too short",
      "string.max": "Phone number is too long",
      "any.required": "Phone number is required",
    }),
    address: Joi.string().trim().min(5).max(500).required().messages({
      "string.min": "Address is too short",
      "any.required": "Address is required",
    }),
    items: Joi.array().min(1).items(orderItemSchema).required().messages({
      "array.min": "Order must contain at least one item",
      "any.required": "Items are required",
    }),
  }),
};
