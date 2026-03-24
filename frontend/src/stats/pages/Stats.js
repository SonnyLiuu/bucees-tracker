import React, { useEffect, useMemo, useState } from "react";

import { useAuthContext } from "../../shared/hooks/useAuthContext";
import MapOverview from "../../map/pages/MapOverview";
import Card from "../../shared/components/UIElements/Card";
import apiClient, { getAuthConfig } from "../../config/apiClient";
import { subscribeToTripsChanged } from "../../trips/utils/tripEvents";

import "./Stats.css";

const formatMoney = (value) => Number.parseFloat(value || 0).toFixed(2);

const StatsMapCard = ({ trips }) => {
  return (
    <section className="stats-page__grid-left" aria-label="Map overview">
      <Card className="stats-page__map-card">
        <div className="stats-page__map-shell">
          <MapOverview Trips={trips} className="stats-page__map-view" />
        </div>
      </Card>
    </section>
  );
};

const StatsOverviewCard = ({ analytics }) => {
  const overview = analytics?.overview;
  const overviewItems = [
    {
      label: "Total Trips",
      value: overview?.totalTrips ?? 0,
    },
    {
      label: "Total Spent",
      value: `$${formatMoney(overview?.totalSpent)}`,
    },
    {
      label: "Most Popular Location",
      value: overview?.mostVisitedLocation?.location || "None yet!",
      subtext: `${overview?.mostVisitedLocation?.trips ?? 0} trips`,
    },
    {
      label: "Highest-Spent Location",
      value: overview?.mostSpentLocation?.location || "None yet!",
      subtext: `$${formatMoney(overview?.mostSpentLocation?.spent)} in ${
        overview?.mostSpentLocation?.trips ?? 0
      } trips`,
    },
    {
      label: "Most Popular Item",
      value: overview?.mostItemCategory?.category || "None yet!",
      subtext: `${overview?.mostItemCategory?.count ?? 0} trips`,
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

const StatsStateBreakdownCard = ({ stateStats, analytics }) => {
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
            <div key={state.stateCode} className="stats-page__state-table-row">
              <span>{state.name}</span>
              <span>
                {state.visitedLocations}/{state.totalLocations}
              </span>
              <span>{state.trips}</span>
              <span>${formatMoney(state.spent)}</span>
            </div>
          ))}
        </div>

        <div className="stats-page__state-total">
          Grand Total: ${formatMoney(analytics?.overview?.totalSpent)} in{" "}
          {analytics?.overview?.totalTrips ?? 0} trips
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
              <dd className="stats-page__product-value">{item.count}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </aside>
  );
};

const Stats = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trips, setTrips] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          apiClient.get("/api/user/me", getAuthConfig(user)),
          apiClient.get("/api/trips", getAuthConfig(user)),
        ]);

        setAnalytics(userRes.data.analytics || null);
        setTrips(tripsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch stats data:", err);
      }
    };

    fetchData();

    return subscribeToTripsChanged(fetchData);
  }, [user]);

  const stateStats = useMemo(() => analytics?.states || [], [analytics]);
  const productStats = useMemo(() => analytics?.categories || [], [analytics]);

  return (
    <main className="stats-page">
      <section className="stats-page__grid stats-page__grid--top">
        <StatsMapCard trips={trips} />
        <StatsOverviewCard analytics={analytics} />
      </section>

      <section className="stats-page__grid stats-page__grid--bottom">
        <StatsStateBreakdownCard stateStats={stateStats} analytics={analytics} />
        <StatsProductTotalsCard productStats={productStats} />
      </section>
    </main>
  );
};

export default Stats;
