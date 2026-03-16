import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../shared/hooks/useAuthContext";
import { API_BASE } from "../config/api";

export const useLogin = () => {
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const login = async (data) => {
    setError("");

    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (response.status && response.status >= 400 && response.status <= 500) {
      setError(json.message);
    }
    if (response.status == 200) {
      // store user in localStorage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      navigate("/");
    }
  };
  return { login, error };
};
