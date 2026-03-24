const storeCatalog = require("../frontend/src/shared/data/storeCatalog.json");

const findStoreByStoreNumber = (storeNumber) =>
  storeCatalog.find((store) => store.storeNumber === storeNumber) || null;

const findStoreByLocation = (location) =>
  storeCatalog.find((store) => store.name === location) || null;

const findStore = ({ storeNumber, location } = {}) =>
  findStoreByStoreNumber(storeNumber) || findStoreByLocation(location);

module.exports = {
  storeCatalog,
  findStore,
  findStoreByLocation,
  findStoreByStoreNumber,
};
