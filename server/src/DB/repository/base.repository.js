import { store } from "../connectionDB.js";

// JSON-file implementation of the same repository interface used in
// rock-diet-backend (base.repository.js). Function names and the {model,...}
// object-argument style are preserved so services can swap to a real DB by
// replacing only this file.

const collection = (model) => store.read()[model.collectionName] || [];

const matches = (doc, filter = {}) =>
  Object.entries(filter).every(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (value.$gte !== undefined && !(doc[key] >= value.$gte)) return false;
      if (value.$lte !== undefined && !(doc[key] <= value.$lte)) return false;
      return true;
    }
    return doc[key] === value;
  });

const sortDocs = (docs, sort = {}) => {
  const entries = Object.entries(sort);
  if (!entries.length) return docs;
  return [...docs].sort((a, b) => {
    for (const [key, dir] of entries) {
      if (a[key] === b[key]) continue;
      const cmp = a[key] > b[key] ? 1 : -1;
      return dir >= 0 ? cmp : -cmp;
    }
    return 0;
  });
};

export const createOne = async ({ model, data } = {}) => {
  const db = store.read();
  const doc = { _id: data._id || String(Date.now() + Math.random()), ...data };
  db[model.collectionName].push(doc);
  store.save();
  return doc;
};

export const findOne = async ({ model, filter = {} } = {}) => {
  return collection(model).find((doc) => matches(doc, filter)) || null;
};

export const find = async ({ model, filter = {}, options = {} } = {}) => {
  let docs = collection(model).filter((doc) => matches(doc, filter));
  docs = sortDocs(docs, options.sort);
  if (options.skip) docs = docs.slice(options.skip);
  if (options.limit) docs = docs.slice(0, options.limit);
  return docs;
};

export const findById = async ({ model, id } = {}) => {
  return collection(model).find((doc) => doc._id === id) || null;
};

export const findOneAndUpdate = async ({ model, filter = {}, update } = {}) => {
  const db = store.read();
  const docs = db[model.collectionName];
  const idx = docs.findIndex((doc) => matches(doc, filter));
  if (idx === -1) return null;
  docs[idx] = { ...docs[idx], ...update };
  store.save();
  return docs[idx];
};

export const updateOne = async ({ model, filter = {}, update } = {}) => {
  const db = store.read();
  const docs = db[model.collectionName];
  const idx = docs.findIndex((doc) => matches(doc, filter));
  if (idx === -1) return { matched: 0, modified: 0 };
  docs[idx] = { ...docs[idx], ...update };
  store.save();
  return { matched: 1, modified: 1 };
};

export const deleteMany = async ({ model, filter = {} } = {}) => {
  const db = store.read();
  const before = db[model.collectionName].length;
  db[model.collectionName] = db[model.collectionName].filter(
    (doc) => !matches(doc, filter),
  );
  store.save();
  return { deleted: before - db[model.collectionName].length };
};
