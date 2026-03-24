import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginForm from "./LoginForm";
import apiClient from "../../config/apiClient";
import { useAuthContext } from "../../shared/hooks/useAuthContext";
import { useLogin } from "../hooks/useLogin";
import { persistAuthSession } from "../utils/authSession";

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onError, onSuccess }) => (
    <div>
      <button onClick={() => onSuccess({ credential: "google-token" })} type="button">
        Continue with Google
      </button>
      <button onClick={onError} type="button">
        Trigger Google Error
      </button>
    </div>
  ),
}));

vi.mock("../../config/apiClient", () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  },
  getErrorMessage: vi.fn((error, fallbackMessage) => fallbackMessage),
}));

vi.mock("../../shared/hooks/useAuthContext", () => ({
  useAuthContext: vi.fn(),
}));

vi.mock("../hooks/useLogin", () => ({
  useLogin: vi.fn(),
}));

vi.mock("../utils/authSession", () => ({
  persistAuthSession: vi.fn(),
}));

describe("LoginForm", () => {
  const dispatch = vi.fn();
  const login = vi.fn();

  const renderForm = () =>
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

  beforeEach(() => {
    dispatch.mockClear();
    login.mockClear();
    apiClient.post.mockReset();
    persistAuthSession.mockReset();
    useAuthContext.mockReturnValue({ dispatch });
    useLogin.mockReturnValue({ error: "", login });
  });

  it("submits email and password through the login hook", async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret123",
    });
  });

  it("shows auth errors from the login hook", () => {
    useLogin.mockReturnValue({ error: "Bad credentials", login });

    renderForm();

    expect(screen.getByRole("alert")).toHaveTextContent(/bad credentials/i);
  });

  it("completes Google login and persists the auth session", async () => {
    const authPayload = { token: "abc123", user: { email: "test@example.com" } };

    apiClient.post.mockResolvedValueOnce({ data: authPayload });

    renderForm();

    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/api/auth/google", {
        credential: "google-token",
      });
    });

    await waitFor(() => {
      expect(persistAuthSession).toHaveBeenCalledWith(authPayload);
    });

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: authPayload,
        type: "LOGIN",
      });
    });
  });

  it("shows a Google login error when the provider fails", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: /trigger google error/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/google login failed/i);
  });
});
