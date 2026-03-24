import { useState } from "react";
import apiClient, { getErrorMessage } from "../../config/apiClient";

export const useSignup = () => {
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const signup = async (data) => {
    try {
      setError("");
      setMsg("");

      const { data: responseData } = await apiClient.post("/api/auth/register", data);
      setMsg(responseData.message || "Verification Email Sent!");
    } catch (err) {
      setError(getErrorMessage(err, "Network/server error. Please try again."));
    }
  };

  return { signup, error, msg };
};
