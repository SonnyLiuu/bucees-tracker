import { useEffect, useState } from "react";

const useSectionReveal = (targetRef, threshold = 0.18) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentSection = targetRef?.current;

    if (!currentSection) {
      return undefined;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(currentSection);

    return () => observer.disconnect();
  }, [targetRef, threshold]);

  return isVisible;
};

export default useSectionReveal;
