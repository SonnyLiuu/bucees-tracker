import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AuthPage from "./AuthPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("./LoginForm", () => ({ default: () => <div>login form content</div> }));
vi.mock("./SignupForm", () => ({
  default: () => <div>signup form content</div>,
}));

describe("AuthPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders login mode by default content", () => {
    render(<AuthPage mode="login" />);

    expect(
      screen.getByRole("heading", { name: /welcome back\./i })
    ).toBeInTheDocument();
    expect(screen.getByText(/login form content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /login/i })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("renders signup mode content", () => {
    render(<AuthPage mode="signup" />);

    expect(
      screen.getByRole("heading", { name: /create your account\./i })
    ).toBeInTheDocument();
    expect(screen.getByText(/signup form content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /sign up/i })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("navigates when switching auth modes", async () => {
    render(<AuthPage mode="login" />);

    fireEvent.click(screen.getByRole("tab", { name: /sign up/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});
