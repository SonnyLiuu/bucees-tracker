import React, { useEffect, useMemo, useState } from "react";

import { useAuthContext } from "../../shared/hooks/useAuthContext";
import MapOverview from "../../map/pages/MapOverview";
import Card from "../../shared/components/UIElements/Card";

import "./Stats.css";

import { API_BASE } from "../config/api";

const locationFields = [
  { name: "Alabama", prefix: "al", total: 4 },
  { name: "Florida", prefix: "fl", total: 2 },
  { name: "Georgia", prefix: "ga", total: 2 },
  { name: "Kentucky", prefix: "ky", total: 1 },
  { name: "South Carolina", prefix: "sc", total: 1 },
  { name: "Tennessee", prefix: "tn", total: 2 },
  { name: "Texas", prefix: "tx", total: 34 },
];

const productFields = [
  ["Gas", "total_gas"],
  ["Brisket", "total_brisket"],
  ["Dessert", "total_dessert"],
  ["Jerky", "total_jerky"],
  ["Outdoor", "total_outdoor"],
  ["3rd Party Items", "total_3rdparty"],
  ["Hot Grab n' Go", "total_hotgrab"],
  ["Cold Grab n' Go", "total_coldgrab"],
];

const formatMoney = (value) => Number.parseFloat(value || 0).toFixed(2);

const StatsMapCard = ({ userData, trips }) => {
  return (
    <section className="stats-page__grid-left" aria-label="Map overview">
      <Card className="stats-page__map-card">
        <div className="stats-page__map-shell">
          <MapOverview
            userData={userData}
            Trips={trips}
            className="stats-page__map-view"
          />
        </div>
      </Card>
    </section>
  );
};

const StatsOverviewCard = ({ userData }) => {
  const overviewItems = [
    {
      label: "Total Trips",
      value: userData?.total_trips ?? 0,
    },
    {
      label: "Total Spent",
      value: `$${formatMoney(userData?.total_spent)}`,
    },
    {
      label: "Most Popular Location",
      value: userData?.most_visited_location || "None yet!",
      subtext: `${userData?.most_visited_location_trips ?? 0} trips`,
    },
    {
      label: "Highest-Spent Location",
      value: userData?.most_spent_location || "None yet!",
      subtext: `$${formatMoney(userData?.most_spent_location_spent)} in ${
        userData?.most_spent_location_trips ?? 0
      } trips`,
    },
    {
      label: "Most Popular Item",
      value: userData?.most_item_category || "None yet!",
      subtext: `${userData?.most_item_category_count ?? 0} trips`,
    },
  ];

  return (
    <aside className="stats-page__grid-right" aria-label="Overview">
      <Card className="stats-page__overview-card">
        <h2 className="stats-page__card-title">Overview</h2>

        <div className="stats-page__overview-list">
          {overviewItems.map((item) => (
            <div key={item.label} className="stats-page__overview-item">
              <h4 className="stats-page__overview-label">{item.label}</h4>
              <p className="stats-page__overview-value">{item.value}</p>
              {item.subtext && (
                <p className="stats-page__overview-subtext">{item.subtext}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
};

const StatsStateBreakdownCard = ({ stateStats, userData }) => {
  return (
    <section className="stats-page__grid-left" aria-label="State breakdown">
      <Card className="stats-page__state-card">
        <h2 className="stats-page__card-title">State Breakdown</h2>

        <div className="stats-page__state-table">
          <div className="stats-page__state-table-row stats-page__state-table-row--header">
            <span>State</span>
            <span>Visited</span>
            <span>Trips</span>
            <span>Spent</span>
          </div>

          {stateStats.map((state) => (
            <div key={state.prefix} className="stats-page__state-table-row">
              <span>{state.name}</span>
              <span>
                {state.unique}/{state.total}
              </span>
              <span>{state.trips}</span>
              <span>${formatMoney(state.spent)}</span>
            </div>
          ))}
        </div>

        <div className="stats-page__state-total">
          Grand Total: ${formatMoney(userData?.total_spent)} in{" "}
          {userData?.total_trips ?? 0} trips
        </div>
      </Card>
    </section>
  );
};

const StatsProductTotalsCard = ({ productStats }) => {
  return (
    <aside className="stats-page__grid-right" aria-label="Product totals">
      <Card className="stats-page__products-card">
        <h2 className="stats-page__card-title">Product Totals</h2>

        <dl className="stats-page__products-grid">
          {productStats.map((item) => (
            <div key={item.key} className="stats-page__product-item">
              <dt className="stats-page__product-label">{item.label}</dt>
              <dd className="stats-page__product-value">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </aside>
  );
};

const Stats = () => {
  const [userData, setUserData] = useState(null);
  const [trips, setTrips] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const email = user?.userData?.email;
    if (!email) return;

    const fetchData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/${email}`),
          fetch(`${API_BASE}/api/trips/${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        const userJson = await userRes.json();
        const tripsJson = await tripsRes.json();

        if (userRes.ok) {
          setUserData(userJson.userData);
        }

        if (tripsRes.ok) {
          setTrips(tripsJson.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch stats data:", err);
      }
    };

    fetchData();
  }, [user]);

  const stateStats = useMemo(() => {
    return locationFields.map(({ name, prefix, total }) => ({
      name,
      prefix,
      total,
      unique: userData?.[`${prefix}_unique`] ?? 0,
      trips: userData?.[`${prefix}_trips`] ?? 0,
      spent: userData?.[`${prefix}_total`] ?? 0,
    }));
  }, [userData]);

  const productStats = useMemo(() => {
    return productFields.map(([label, key]) => ({
      label,
      key,
      value: userData?.[key] ?? 0,
    }));
  }, [userData]);

  return (
    <main className="stats-page">
      <section className="stats-page__grid stats-page__grid--top">
        <StatsMapCard userData={userData} trips={trips} />
        <StatsOverviewCard userData={userData} />
      </section>

      <section className="stats-page__grid stats-page__grid--bottom">
        <StatsStateBreakdownCard stateStats={stateStats} userData={userData} />
        <StatsProductTotalsCard productStats={productStats} />
      </section>
    </main>
  );
};

export default Stats;
