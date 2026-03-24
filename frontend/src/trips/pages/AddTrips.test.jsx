import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AddTrips from "./AddTrips";

vi.mock("../hooks/useAddTrip", () => ({
  useAddTrips: () => ({
    addTrips: vi.fn(),
    error: "",
    msg: "",
  }),
}));

describe("AddTrips", () => {
  it("renders locations from the shared store catalog", () => {
    render(<AddTrips />);

    expect(
      screen.getByRole("option", {
        name: "#1 Lake Jackson, TX (899 Oyster Creek)",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "#58 Auburn, AL",
      })
    ).toBeInTheDocument();
  });
});
