import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ExecutionProgress } from "./ExecutionProgress";

describe("ExecutionProgress", () => {
  it("renders status and inferred progress when progress omitted", () => {
    render(<ExecutionProgress completedSteps={3} status="running" />);
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Running" })).toBeTruthy();
  });

  it("renders percent when progress is provided", () => {
    render(
      <ExecutionProgress
        status="running"
        progress={0.3}
        completedSteps={3}
        totalSteps={10}
      />
    );
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("3 / 10"))).toBeInTheDocument();
  });

  it("clamps progress to [0,1]", () => {
    render(<ExecutionProgress status="running" progress={99} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders failed status and message when provided", () => {
    render(
      <ExecutionProgress
        status="failed"
        label="Execution"
        detail="Boom"
        progress={1}
      />
    );
    expect(screen.getByText((c) => c.includes("Failed"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("Boom"))).toBeInTheDocument();
  });
});

