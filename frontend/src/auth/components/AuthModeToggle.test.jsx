import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthModeToggle from "./AuthModeToggle";

describe("AuthModeToggle", () => {
  it("marks the active mode as selected", () => {
    const onModeChange = vi.fn();

    render(<AuthModeToggle mode="login" onModeChange={onModeChange} />);

    expect(screen.getByRole("tab", { name: /login/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /sign up/i })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("supports arrow key navigation between modes", () => {
    const onModeChange = vi.fn();

    render(<AuthModeToggle mode="login" onModeChange={onModeChange} />);

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });

    expect(onModeChange).toHaveBeenCalledWith("signup");
  });
});
