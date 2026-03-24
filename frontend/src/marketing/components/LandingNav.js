import { Link } from "react-router-dom";

import logo from "../../shared/images/bucees-logo.png";

const LandingNav = ({ isScrolled }) => {
  return (
    <header className="landing-page__header">
      <nav
        aria-label="Landing page"
        className={`landing-page__nav ${
          isScrolled ? "landing-page__nav--scrolled" : ""
        }`}
      >
        <Link
          aria-label="Bucee's Tracker home"
          className="landing-page__brand"
          to="/"
        >
          <img
            className="landing-page__brand-logo"
            src={logo}
            alt=""
          />
          <span>Bucee's Tracker</span>
        </Link>

        <Link className="landing-page__cta" to="/login">
          Get Started
        </Link>
      </nav>
    </header>
  );
};

export default LandingNav;
