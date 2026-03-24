import { Link } from "react-router-dom";

const LandingHero = ({ onScrollToFeatures }) => {
  return (
    <section
      aria-describedby="landing-hero-copy"
      aria-labelledby="landing-hero-title"
      className="landing-page__hero"
    >
      <div className="landing-page__hero-inner">
        <p className="landing-page__eyebrow">
          A simple travel log for Bucee's fans
        </p>
        <h1 className="landing-page__headline" id="landing-hero-title">
          Track every stop, map every visit, and see your Bucee&apos;s history
          all in one place.
        </h1>
        <p className="landing-page__subheadline" id="landing-hero-copy">
          Built for people who want to remember where they stopped, what they
          spent, and log their journey to every Bucee's they stop by.
        </p>
        <div className="landing-page__hero-actions">
          <button
            aria-controls="features"
            className="landing-page__scroll-link"
            onClick={onScrollToFeatures}
            type="button"
          >
            Explore features
          </button>
          <Link className="landing-page__hero-cta" to="/login">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
