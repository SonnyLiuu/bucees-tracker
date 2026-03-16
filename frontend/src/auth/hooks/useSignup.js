import { useState } from "react";
import { API_BASE } from "../config/api";

export const useSignup = () => {
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const signup = async (data) => {
    setError(null);

    const response = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    // Server picky about user's input
    if (response.status && response.status >= 400 && response.status <= 500) {
      setError(json.message);
    }

    // email verification sent
    if (response.status == 201) {
      setMsg(json.message);
    }

    // email verified and successful signup
    if (response.status == 200) {
      setMsg(json.message);
    }
  };

  return { signup, error, msg };
};
