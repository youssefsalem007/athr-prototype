import categoryModel from "../../DB/model/category.model.js";
import productModel from "../../DB/model/product.model.js";
import * as db_repository from "../../DB/repository/base.repository.js";

export const getCategories = async () => {
  const categories = await db_repository.find({ model: categoryModel });
  const products = await db_repository.find({ model: productModel });

  return categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.category === c.id).length,
  }));
};
