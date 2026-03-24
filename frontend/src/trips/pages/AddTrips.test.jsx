import { render, screen } from "@testing-library/react";

import AddTrips from "./AddTrips";

jest.mock("../hooks/useAddTrip", () => ({
  useAddTrips: () => ({
    addTrips: jest.fn(),
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
