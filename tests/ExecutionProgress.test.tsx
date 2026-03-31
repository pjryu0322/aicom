import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExecutionProgress } from "../src/components/ExecutionProgress";

describe("ExecutionProgress", () => {
  it("renders indeterminate state when percent is missing", () => {
    render(
      <ExecutionProgress
        label="Import users"
        status="running"
        percent={undefined}
        detail="3 steps"
      />,
    );
    expect(screen.getByText("Import users")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps percent to [0,100] and displays it", () => {
    render(<ExecutionProgress label="Sync" percent={999} status="running" />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("shows failed state and still renders progress info", () => {
    render(
      <ExecutionProgress label="Export" percent={20} status="failed" detail="1/5" />,
    );
    expect(screen.getByText("failed")).toBeInTheDocument();
    expect(screen.getByText("1/5")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });
});

