import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Signup from "./auth/pages/Signup/Signup";
import Login from "./auth/pages/Login/Login";
import EmailVerify from "./auth/pages/EmailVerify";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";

import Trips from "./trips/pages/Trips";
import AddTrip from "./trips/pages/AddTrips";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Stats from "./stats/pages/Stats";

import { useAuthContext } from "./shared/hooks/useAuthContext";

import "./App.css";

const App = () => {
  const { user } = useAuthContext();

  return (
    <>
      <Router>
        {user && <MainNavigation />}
        <Routes>
          <Route
            path="/"
            exact
            element={user ? <Stats /> : <Navigate to="/login" />}
          />
          <Route
            path="/trips"
            exact
            element={user ? <Trips /> : <Navigate to="/" />}
          />
          <Route
            path="/add"
            exact
            element={user ? <AddTrip /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            exact
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            exact
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/users/:id/reset-password/:token"
            element={<ResetPassword />}
          />
        </Routes>
      </Router>
    </>
  );
};
export default App;
