const { storeCatalog } = require("../data/storeCatalog");
const { listTripsByUser } = require("./tripService");

const stateNamesByCode = {
  AL: "Alabama",
  FL: "Florida",
  GA: "Georgia",
  KY: "Kentucky",
  SC: "South Carolina",
  TN: "Tennessee",
  TX: "Texas",
};

const categoryDefinitions = [
  { key: "didGas", label: "Gas" },
  { key: "didBrisket", label: "Brisket" },
  { key: "didDessert", label: "Dessert" },
  { key: "didJerky", label: "Jerky" },
  { key: "didOutdoor", label: "Outdoor" },
  { key: "did3rdParty", label: "3rd Party Items" },
  { key: "didHotGrab", label: "Hot Grab n' Go" },
  { key: "didColdGrab", label: "Cold Grab n' Go" },
  { key: "didHomeGood", label: "Home Goods" },
];

const storeTotalsByState = storeCatalog.reduce((totals, store) => {
  totals[store.stateCode] = (totals[store.stateCode] || 0) + 1;
  return totals;
}, {});
const storeByName = new Map(storeCatalog.map((store) => [store.name, store]));

const buildEmptyLocationSummary = () => ({
  location: "None yet!",
  trips: 0,
  spent: 0,
});

const buildEmptyCategorySummary = () => ({
  category: "None yet!",
  count: 0,
});

const getUserAnalytics = async (user) => {
  const trips = await listTripsByUser(user);

  const categoryCounts = Object.fromEntries(
    categoryDefinitions.map((category) => [category.key, 0])
  );
  const locationStats = new Map();
  const stateStats = new Map(
    Object.entries(stateNamesByCode).map(([stateCode, name]) => [
      stateCode,
      {
        stateCode,
        name,
        totalLocations: storeTotalsByState[stateCode] || 0,
        visitedLocations: 0,
        trips: 0,
        spent: 0,
        _visitedLocationSet: new Set(),
      },
    ])
  );

  let totalTrips = 0;
  let totalSpent = 0;

  for (const trip of trips) {
    totalTrips += 1;
    totalSpent += Number(trip.total || 0);

    const existingLocationStats = locationStats.get(trip.location) || {
      location: trip.location,
      trips: 0,
      spent: 0,
    };

    existingLocationStats.trips += 1;
    existingLocationStats.spent += Number(trip.total || 0);
    locationStats.set(trip.location, existingLocationStats);

    const matchedStore = storeByName.get(trip.location);

    if (matchedStore) {
      const stateStat = stateStats.get(matchedStore.stateCode);

      if (stateStat) {
        stateStat.trips += 1;
        stateStat.spent += Number(trip.total || 0);
        stateStat._visitedLocationSet.add(trip.location);
      }
    }

    for (const category of categoryDefinitions) {
      if (trip[category.key] === true) {
        categoryCounts[category.key] += 1;
      }
    }
  }

  const mostVisitedLocation =
    Array.from(locationStats.values()).sort((left, right) => {
      if (right.trips !== left.trips) {
        return right.trips - left.trips;
      }

      return right.spent - left.spent;
    })[0] || buildEmptyLocationSummary();

  const mostSpentLocation =
    Array.from(locationStats.values()).sort((left, right) => {
      if (right.spent !== left.spent) {
        return right.spent - left.spent;
      }

      return right.trips - left.trips;
    })[0] || buildEmptyLocationSummary();

  const categories = categoryDefinitions.map((category) => ({
    key: category.key,
    label: category.label,
    count: categoryCounts[category.key],
  }));

  const topCategory = categories
    .slice()
    .sort((left, right) => right.count - left.count)[0];

  const mostItemCategory =
    topCategory && topCategory.count > 0
      ? { category: topCategory.label, count: topCategory.count }
      : buildEmptyCategorySummary();

  const states = Array.from(stateStats.values()).map((state) => ({
    stateCode: state.stateCode,
    name: state.name,
    totalLocations: state.totalLocations,
    visitedLocations: state._visitedLocationSet.size,
    trips: state.trips,
    spent: state.spent,
  }));

  return {
    overview: {
      totalTrips,
      totalSpent,
      mostVisitedLocation,
      mostSpentLocation,
      mostItemCategory,
    },
    states,
    categories,
  };
};

module.exports = {
  getUserAnalytics,
};
