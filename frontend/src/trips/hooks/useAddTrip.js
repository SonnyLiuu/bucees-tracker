import { useState } from "react";
import { useAuthContext } from "../../shared/hooks/useAuthContext";
import apiClient, { getAuthConfig, getErrorMessage } from "../../config/apiClient";
import { emitTripsChanged } from "../utils/tripEvents";

export const useAddTrips = () => {
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const { user } = useAuthContext();

  const addTrips = async (data) => {
    try {
      setError("");
      setMsg("");

      const response = await apiClient.post("/api/trips", data, getAuthConfig(user));
      setMsg(response.data.message);
      emitTripsChanged();
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Unable to save trip."));
      return false;
    }
  };

  return { addTrips, error, msg };
};

export default useAddTrips;
