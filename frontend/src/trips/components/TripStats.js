import React, { useEffect, useState } from "react";
import TripItem from "./TripItem";
import { useAuthContext } from "../../shared/hooks/useAuthContext";
import Card from "../../shared/components/UIElements/Card";
import "./TripStats.css";
import { API_BASE } from "../config/api";

const TripStats = (props) => {
  const [userData, setUserData] = useState(null);
  const [Trips, setTrips] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `${API_BASE}/api/user/${user.userData.email}`
      );

      const json = await response.json();

      if (response.status === 200) {
        setUserData(json.userData);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="trips-stats-container">
      {userData && (
        <Card className="trips-stats-content">
          <h1 className="tripStatsHeader">Trips Overview</h1>
          <h4 className="tripStats">
            Most Visited at {userData.most_visited_location}: $
            {parseFloat(userData.most_visited_location_spent).toFixed(2)} in{" "}
            {userData.most_visited_location_trips} trip(s)
          </h4>
          <h4 className="tripStats">
            Most Spent at {userData.most_spent_location}: $
            {parseFloat(userData.most_spent_location_spent).toFixed(2)} in{" "}
            {userData.most_spent_location_trips} trip(s){" "}
          </h4>
          <h4 className="tripStats">
            Most Bought Item: {userData.most_item_category} bought{" "}
            {userData.most_item_category_count} time(s){" "}
          </h4>
        </Card>
      )}
    </div>
  );
};

export default TripStats;
