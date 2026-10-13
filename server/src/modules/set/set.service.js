import setModel from "../../DB/model/set.model.js";
import * as db_repository from "../../DB/repository/base.repository.js";

export const getSets = async () => {
  return db_repository.find({ model: setModel });
};

export const getSetBySlug = async (slug) => {
  const set = await db_repository.findOne({ model: setModel, filter: { slug } });
  if (!set) {
    throw new Error("Set not found", { cause: 404 });
  }
  return set;
};
