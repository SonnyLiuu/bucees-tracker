import { useRef } from "react";

import LandingFeatures from "../components/LandingFeatures";
import LandingFooter from "../components/LandingFooter";
import LandingHero from "../components/LandingHero";
import LandingNav from "../components/LandingNav";
import { footerNavigationLinks } from "../data/footerLinks";
import { featureCards } from "../data/featureCards";
import useScrolledState from "../hooks/useScrolledState";
import "./LandingPage.css";

const LandingPage = () => {
  const featuresRef = useRef(null);
  const footerRef = useRef(null);
  const isScrolled = useScrolledState();

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="landing-page">
      <a className="landing-page__skip-link" href="#features">
        Skip to features
      </a>
      <LandingNav isScrolled={isScrolled} />
      <LandingHero onScrollToFeatures={scrollToFeatures} />
      <LandingFeatures features={featureCards} sectionRef={featuresRef} />
      <LandingFooter
        isScrolled={isScrolled}
        links={footerNavigationLinks}
        onScrollToFeatures={scrollToFeatures}
        onScrollToTop={scrollToTop}
        sectionRef={footerRef}
      />
    </main>
  );
};

export default LandingPage;
