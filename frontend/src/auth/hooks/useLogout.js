import { clearAuthSession } from "../utils/authSession";
import { useAuthContext } from "../../shared/hooks/useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    clearAuthSession();
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
