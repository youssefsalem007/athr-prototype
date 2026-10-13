import Joi from "joi";

export const productQuerySchema = {
  query: Joi.object({
    category: Joi.string().valid("him", "her", "unisex").optional(),
    q: Joi.string().trim().max(100).allow("").optional(),
    sort: Joi.string()
      .valid("price_asc", "price_desc", "new", "best")
      .optional(),
  }),
};

export const productSlugSchema = {
  params: Joi.object({
    slug: Joi.string().trim().min(1).max(120).required(),
  }),
};
