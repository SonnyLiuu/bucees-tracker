import storeCatalog from "./storeCatalog.json";

export { storeCatalog };

export const storeTotalsByState = storeCatalog.reduce((totals, store) => {
  totals[store.stateCode] = (totals[store.stateCode] || 0) + 1;
  return totals;
}, {});

export const findStoreByLocation = (location) =>
  storeCatalog.find((store) => store.name === location) || null;

export const findStoreByStoreNumber = (storeNumber) =>
  storeCatalog.find((store) => store.storeNumber === storeNumber) || null;
