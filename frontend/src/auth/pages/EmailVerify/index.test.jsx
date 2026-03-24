import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import EmailVerify from "./index";
import apiClient from "../../../config/apiClient";

jest.mock("../../../config/apiClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("EmailVerify", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={["/users/123/verify/abc"]}>
        <Routes>
          <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
        </Routes>
      </MemoryRouter>
    );

  it("shows the success message after verification", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "ok" } });

    renderPage();

    expect(
      await screen.findByText(/verified successfully\./i)
    ).toBeInTheDocument();

    expect(screen.getByText(/you may close this tab now\./i)).toBeInTheDocument();
  });

  it("shows the invalid message when verification fails", async () => {
    apiClient.get.mockRejectedValueOnce(new Error("bad link"));

    renderPage();

    expect(
      await screen.findByText(/verification link is invalid or expired\./i)
    ).toBeInTheDocument();
  });
});
