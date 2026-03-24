import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LandingPage from "./LandingPage";

const intersectionObservers = [];

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    intersectionObservers.push(this);
  }
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );

const triggerIntersection = (observerIndex, isIntersecting = true) => {
  const observer = intersectionObservers[observerIndex];
  act(() => {
    observer.callback([{ isIntersecting }]);
  });
};

const triggerAllIntersections = (isIntersecting = true) => {
  intersectionObservers.forEach((_, index) => {
    triggerIntersection(index, isIntersecting);
  });
};

describe("LandingPage", () => {
  let scrollIntoViewMock;
  let scrollToMock;

  beforeAll(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });
  });

  beforeEach(() => {
    intersectionObservers.length = 0;
    scrollIntoViewMock = jest.fn();
    scrollToMock = jest.fn();
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      writable: true,
      value: scrollIntoViewMock,
    });
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      writable: true,
      value: scrollToMock,
    });
  });

  it("renders the landing hero and get started entry point", () => {
    renderPage();
    const nav = screen.getByRole("navigation", { name: /landing page/i });

    expect(
      screen.getByRole("heading", {
        name: /track every stop, map every visit/i,
      })
    ).toBeInTheDocument();

    expect(
      within(nav).getByRole("link", { name: /get started/i })
    ).toHaveAttribute("href", "/login");
  });

  it("scrolls to the features section from the hero button", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /explore features/i }));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("updates the nav style after scrolling", () => {
    renderPage();

    const nav = screen.getByRole("navigation", { name: /landing page/i });
    expect(nav).not.toHaveClass("landing-page__nav--scrolled");

    window.scrollY = 120;
    fireEvent.scroll(window);

    expect(nav).toHaveClass("landing-page__nav--scrolled");
  });

  it("activates a feature card when it is focused", () => {
    renderPage();

    const featureCard = screen.getByRole("button", { name: /map your route/i });
    fireEvent.focus(featureCard);

    expect(featureCard).toHaveClass("landing-page__feature-card--active");
  });

  it("clears the feature highlight as soon as the cursor leaves a card", () => {
    renderPage();

    const featureCard = screen.getByRole("button", { name: /map your route/i });

    fireEvent.mouseEnter(featureCard);
    expect(featureCard).toHaveClass("landing-page__feature-card--active");

    fireEvent.mouseLeave(featureCard);
    expect(featureCard).not.toHaveClass("landing-page__feature-card--active");
  });

  it("reveals feature cards when the section enters view", () => {
    renderPage();

    const featureCard = screen.getByRole("button", { name: /log every stop/i });
    expect(featureCard).not.toHaveClass("landing-page__feature-card--visible");

    triggerAllIntersections(true);

    expect(featureCard).toHaveClass("landing-page__feature-card--visible");
  });

  it("activates the footer create-account CTA when it is focused", () => {
    renderPage();

    const footerCreateAccountLink = screen.getByRole("link", {
      name: /create account/i,
    });

    fireEvent.focus(footerCreateAccountLink);

    expect(footerCreateAccountLink).toHaveClass(
      "landing-page__footer-button--active"
    );
  });

  it("clears the footer active state as soon as the cursor leaves a footer link", () => {
    renderPage();

    const footerNav = screen.getByRole("navigation", { name: /explore/i });
    const footerGetStartedLink = within(footerNav).getByRole("link", {
      name: /get started/i,
    });

    fireEvent.mouseEnter(footerGetStartedLink);
    expect(footerGetStartedLink).toHaveClass(
      "landing-page__footer-link--active"
    );

    fireEvent.mouseLeave(footerGetStartedLink);
    expect(footerGetStartedLink).not.toHaveClass(
      "landing-page__footer-link--active"
    );
  });

  it("enables back to top only after the page has been scrolled", () => {
    renderPage();

    const backToTopButton = screen.getByRole("button", { name: /back to top/i });
    expect(backToTopButton).toBeDisabled();

    window.scrollY = 120;
    fireEvent.scroll(window);

    expect(backToTopButton).toBeEnabled();

    fireEvent.click(backToTopButton);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
