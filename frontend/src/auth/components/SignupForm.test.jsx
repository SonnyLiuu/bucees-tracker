import { fireEvent, render, screen } from "@testing-library/react";

import SignupForm from "./SignupForm";
import { useSignup } from "../hooks/useSignup";

jest.mock("../hooks/useSignup", () => ({
  useSignup: jest.fn(),
}));

describe("SignupForm", () => {
  const signup = jest.fn();

  beforeEach(() => {
    signup.mockClear();
    useSignup.mockReturnValue({ error: "", msg: "", signup });
  });

  it("submits the full signup payload", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Sonny" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Liu" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "sonny@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(signup).toHaveBeenCalledWith({
      email: "sonny@example.com",
      firstName: "Sonny",
      lastName: "Liu",
      password: "secret123",
    });
  });

  it("shows signup errors", () => {
    useSignup.mockReturnValue({
      error: "Email already in use",
      msg: "",
      signup,
    });

    render(<SignupForm />);

    expect(screen.getByRole("alert")).toHaveTextContent(/email already in use/i);
  });

  it("shows signup success messaging", () => {
    useSignup.mockReturnValue({
      error: "",
      msg: "Verification email sent",
      signup,
    });

    render(<SignupForm />);

    expect(screen.getByRole("status")).toHaveTextContent(
      /verification email sent/i
    );
  });
});
