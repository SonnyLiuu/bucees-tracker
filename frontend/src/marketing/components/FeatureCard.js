const FeatureCard = ({
  accentClass,
  badge,
  description,
  index,
  isActive,
  isVisible,
  onActivate,
  onDeactivate,
  title,
}) => {
  const cardClassName = [
    "landing-page__feature-card",
    isVisible ? "landing-page__feature-card--visible" : "",
    isActive ? "landing-page__feature-card--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <article
      aria-pressed={isActive}
      className={cardClassName}
      onBlur={onDeactivate}
      onFocus={onActivate}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onTouchStart={onActivate}
      role="button"
      style={{ "--feature-reveal-delay": `${index * 80}ms` }}
      tabIndex={0}
    >
      <div className={`landing-page__feature-badge ${accentClass}`}>{badge}</div>
      <h3 className="landing-page__feature-title">{title}</h3>
      <p className="landing-page__feature-copy">{description}</p>
    </article>
  );
};

export default FeatureCard;
