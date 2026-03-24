import { createContext, useEffect, useReducer } from "react";
import { readAuthSession } from "../../auth/utils/authSession";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  // if a user is in local storage, set state to logged in
  useEffect(() => {
    const user = readAuthSession();

    if (user) {
      dispatch({ type: "LOGIN", payload: user })
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};



