import { fireEvent, render, screen } from "@testing-library/react";

import AuthPage from "./AuthPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("./LoginForm", () => () => <div>login form content</div>);
jest.mock("./SignupForm", () => () => <div>signup form content</div>);

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
