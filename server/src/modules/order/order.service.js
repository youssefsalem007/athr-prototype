import orderModel from "../../DB/model/order.model.js";
import * as db_repository from "../../DB/repository/base.repository.js";
import { getProductById, findSize } from "../product/product.service.js";
import { FREE_SHIPPING_THRESHOLD } from "../../config/config.service.js";

const round2 = (n) => Math.round(n * 100) / 100;

// Server recalculates every line from its OWN prices — client totals are
// never trusted. Mirrors the totalPrice accumulation pattern in
// rock-diet-backend order.service.js.
export const createOrder = async ({ name, phone, address, items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty", { cause: 400 });
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await getProductById(item.productId);
    const size = findSize(product, item.size);

    if (!size) {
      throw new Error(
        `Size "${item.size}" not available for "${product.name}"`,
        { cause: 400 },
      );
    }

    const lineTotal = size.priceEGP * item.qty;
    subtotal += lineTotal;

    orderItems.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: size.label,
      unitPrice: size.priceEGP,
      qty: item.qty,
      lineTotal: round2(lineTotal),
    });
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 65;
  const total = round2(subtotal + shipping);

  const order = await db_repository.createOne({
    model: orderModel,
    data: {
      name,
      phone,
      address,
      items: orderItems,
      subtotal: round2(subtotal),
      shipping,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    },
  });

  return order;
};

export const getOrders = async () => {
  const orders = await db_repository.find({
    model: orderModel,
    options: { sort: { createdAt: -1 } },
  });
  return orders;
};
