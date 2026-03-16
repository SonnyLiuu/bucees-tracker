import React, { useEffect, useState } from "react";
import TripItem from "../components/TripItem";
import AddTrips from "./AddTrips";

import { useAuthContext } from "../../shared/hooks/useAuthContext";
import Card from "../../shared/components/UIElements/Card";

import "./Trips.css";
import { API_BASE } from "../config/api";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const email = user?.userData?.email;
    if (!email) return;

    const fetchTrips = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/trips/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const json = await response.json();

        if (response.ok) {
          setTrips(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      }
    };

    fetchTrips();
  }, [user]);

  return (
    <main className="trips-page">
      <section className="trips-page__layout">
        <section className="trips-page__history" aria-label="Trip history">
          <Card className="trips-page__history-card">
            <header className="trips-page__header">
              <h1 className="trips-page__title">Trip History</h1>
              <p className="trips-page__subtitle">{trips.length} total trips</p>
            </header>

            {trips.length > 0 ? (
              <ul className="trips-page__list">
                {trips.map((trip) => (
                  <li key={trip._id} className="trips-page__list-item">
                    <TripItem
                      className="trip"
                      id={trip._id}
                      date={trip.date}
                      latitude={trip.latitude}
                      longitude={trip.longitude}
                      location={trip.location}
                      total={trip.total}
                      didGas={trip.didGas}
                      didBrisket={trip.didBrisket}
                      didDessert={trip.didDessert}
                      didHomeGood={trip.didHomeGood}
                      didOutdoor={trip.didOutdoor}
                      didJerky={trip.didJerky}
                      didColdGrab={trip.didColdGrab}
                      didHotGrab={trip.didHotGrab}
                      did3rdParty={trip.did3rdParty}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="trips-page__empty">
                <h3>No trips yet</h3>
                <p>Add your first Buc-ee’s stop on the right.</p>
              </div>
            )}
          </Card>
        </section>

        <aside className="trips-page__add" aria-label="Add trip">
          <Card className="trips-page__add-card">
            <header className="trips-page__header">
              <h2 className="trips-page__title">Add Trip</h2>
            </header>
            <AddTrips />
          </Card>
        </aside>
      </section>
    </main>
  );
};

export default Trips;
