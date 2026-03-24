import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../shared/hooks/useAuthContext";
import apiClient, { getErrorMessage } from "../../config/apiClient";
import { persistAuthSession } from "../utils/authSession";

export const useLogin = () => {
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const login = async (data) => {
    try {
      setError("");

      const { data: authPayload } = await apiClient.post("/api/auth/login", data);

      persistAuthSession(authPayload);
      dispatch({ type: "LOGIN", payload: authPayload });
      navigate("/");
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Login failed"));
    }
  };

  return { login, error };
};
