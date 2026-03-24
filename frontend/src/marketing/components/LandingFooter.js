import { useId, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../shared/images/bucees-logo.png";
import useSectionReveal from "../hooks/useSectionReveal";

const LandingFooter = ({
  isScrolled,
  links,
  onScrollToFeatures,
  onScrollToTop,
  sectionRef,
}) => {
  const brandTitleId = useId();
  const summaryId = useId();
  const navHeadingId = useId();
  const ctaHeadingId = useId();
  const [activeLinkLabel, setActiveLinkLabel] = useState(null);
  const isVisible = useSectionReveal(sectionRef, 0.1);

  const handleActivateLink = (label) => {
    setActiveLinkLabel(label);
  };

  const handleDeactivateLink = () => {
    setActiveLinkLabel(null);
  };

  const getActivationHandlers = (label) => ({
    onBlur: handleDeactivateLink,
    onFocus: () => handleActivateLink(label),
    onMouseEnter: () => handleActivateLink(label),
    onMouseLeave: handleDeactivateLink,
    onTouchStart: () => handleActivateLink(label),
  });

  const getLinkClassName = (label) => {
    return [
      "landing-page__footer-link",
      activeLinkLabel === label ? "landing-page__footer-link--active" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const handleActionClick = (action) => {
    if (action === "features") {
      onScrollToFeatures();
      return;
    }

    if (action === "top" && isScrolled) {
      onScrollToTop();
    }
  };

  return (
    <footer
      aria-describedby={summaryId}
      aria-labelledby={brandTitleId}
      className="landing-page__footer"
      ref={sectionRef}
    >
      <div
        className={`landing-page__footer-inner ${
          isVisible ? "landing-page__footer-inner--visible" : ""
        }`}
      >
        <section
          aria-labelledby={brandTitleId}
          className="landing-page__footer-brand"
        >
          <div className="landing-page__footer-brand-row">
            <img className="landing-page__footer-logo" src={logo} alt="" />
            <h2 className="landing-page__footer-title" id={brandTitleId}>
              Bucee&apos;s Tracker
            </h2>
          </div>
          <p className="landing-page__footer-summary" id={summaryId}>
            Track your stops, spending, and favorite road trip habits in one
            place.
          </p>
        </section>

        <nav
          aria-labelledby={navHeadingId}
          className="landing-page__footer-nav"
        >
          <h3 className="landing-page__footer-heading" id={navHeadingId}>
            Explore
          </h3>
          <ul className="landing-page__footer-links">
            {links.map((link) => (
              <li key={link.label}>
                {link.type === "route" ? (
                  <Link
                    className={getLinkClassName(link.label)}
                    {...getActivationHandlers(link.label)}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    aria-controls={link.action === "features" ? "features" : undefined}
                    className={`${getLinkClassName(link.label)} landing-page__footer-link--button`}
                    disabled={link.action === "top" && !isScrolled}
                    onClick={() => handleActionClick(link.action)}
                    {...getActivationHandlers(link.label)}
                    type="button"
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <section
          aria-labelledby={ctaHeadingId}
          className="landing-page__footer-cta"
        >
          <h3 className="landing-page__footer-heading" id={ctaHeadingId}>
            Start Tracking
          </h3>
          <p className="landing-page__footer-copy">
            Create an account and start building your Bucee&apos;s trip history.
          </p>
          <Link
            className={`landing-page__footer-button ${
              activeLinkLabel === "Create Account"
                ? "landing-page__footer-button--active"
                : ""
            }`}
            {...getActivationHandlers("Create Account")}
            to="/signup"
          >
            Create Account
          </Link>
        </section>
      </div>
    </footer>
  );
};

export default LandingFooter;
