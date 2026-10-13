import productModel from "../../DB/model/product.model.js";
import * as db_repository from "../../DB/repository/base.repository.js";

// Entry price = cheapest size; used for sorting and storefront display.
const startingPrice = (product) =>
  Math.min(...product.sizes.map((s) => s.priceEGP));

export const getProducts = async ({ category, q, sort } = {}) => {
  const filter = {};
  if (category) filter.category = category;

  let products = await db_repository.find({ model: productModel, filter });

  if (q) {
    const needle = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.notes.toLowerCase().includes(needle),
    );
  }

  products = products.map((p) => ({
    ...p,
    startingPrice: startingPrice(p),
  }));

  switch (sort) {
    case "price_asc":
      products.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case "price_desc":
      products.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case "new":
      products.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "best":
      products.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
    default:
      break;
  }

  return products;
};

export const getProductBySlug = async (slug) => {
  const product = await db_repository.findOne({
    model: productModel,
    filter: { slug },
  });

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  return { ...product, startingPrice: startingPrice(product) };
};

export const getProductById = async (id) => {
  const product = await db_repository.findOne({
    model: productModel,
    filter: { id },
  });
  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }
  return product;
};

export const findSize = (product, label) =>
  product.sizes.find((s) => s.label === label) || null;
