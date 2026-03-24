import { useState } from "react";

import FeatureCard from "./FeatureCard";
import useSectionReveal from "../hooks/useSectionReveal";

const LandingFeatures = ({ features, sectionRef }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(null);
  const isVisible = useSectionReveal(sectionRef);

  return (
    <section
      aria-describedby="landing-features-copy"
      aria-labelledby="landing-features-title"
      className="landing-page__features"
      id="features"
      ref={sectionRef}
    >
      <div className="landing-page__section-heading">
        <p className="landing-page__eyebrow">What the app does</p>
        <h2 className="landing-page__section-title" id="landing-features-title">
          A free tool built around the trips themselves.
        </h2>
        <p className="landing-page__section-copy" id="landing-features-copy">
          Everything centers on logging stops quickly and turning those stops
          into useful history, map context, and spending insights.
        </p>
      </div>

      <div
        aria-label="Product features"
        className="landing-page__feature-grid"
        role="list"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            {...feature}
            index={index}
            isActive={activeFeatureIndex === index}
            isVisible={isVisible}
            onActivate={() => setActiveFeatureIndex(index)}
            onDeactivate={() => setActiveFeatureIndex(null)}
          />
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;
