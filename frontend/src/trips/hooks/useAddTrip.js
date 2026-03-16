import { useState } from "react";
import { API_BASE } from "../../config/api";

export const useAddTrips = () => {
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const addTrips = async (data) => {
    setError(null);

    const response = await fetch(`${API_BASE}/api/trips/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    if (response.status && response.status >= 400 && response.status <= 500) {
      setError(json.message);
    }
    if (response.status === 200) {
      setMsg(json.message);
    }
  };

  return { addTrips, error, msg };
};

export default useAddTrips;
