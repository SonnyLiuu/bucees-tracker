import { useState } from "react";
import { API_BASE } from "../../config/api";

export const useSignup = () => {
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const signup = async (data) => {
    try {
      setError("");
      setMsg("");

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      console.log("signup payload:", data);
      console.log("signup status:", response.status);
      console.log("signup response:", json);

      if (response.status >= 400 && response.status <= 500) {
        setError(json.message || "Signup failed");
        return;
      }

      if (response.status === 201 || response.status === 200) {
        setMsg(json.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return { signup, error, msg };
};
