import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExecutionProgress } from "../src/components/ExecutionProgress";

describe("ExecutionProgress", () => {
  it("renders with default props", () => {
    render(<ExecutionProgress />);
    const root = screen.getByTestId("execution-progress");
    expect(root).not.toBeNull();
    expect(root.textContent).toContain("실행 상태");
    expect(root.textContent).toContain("대기 중");
  });

  it("clamps percent between 0 and 100", () => {
    const { rerender } = render(
      <ExecutionProgress label="test" status="running" percent={-10} />,
    );
    const negativePercentNode = screen.getByText(/%/).previousSibling;
    expect(negativePercentNode && negativePercentNode.textContent).toContain(
      "0",
    );

    rerender(<ExecutionProgress label="test" status="running" percent={150} />);
    const overPercentNode = screen.getByText(/%/).previousSibling;
    expect(overPercentNode && overPercentNode.textContent).toContain("100");
  });

  it("shows progress bar when running", () => {
    render(<ExecutionProgress status="running" percent={42} />);
    const root = screen.getByTestId("execution-progress");
    const bar = root.querySelector("div[style]");
    expect(bar).toBeTruthy();
  });

  it("hides detail text in compact mode", () => {
    render(
      <ExecutionProgress
        label="test"
        status="running"
        percent={10}
        detail="현재 단계"
        compact
      />,
    );

    expect(screen.queryByText("현재 단계")).toBeNull();
  });
});

