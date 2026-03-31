import * as React from "react";

export type ExecutionProgressStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled";

export type ExecutionProgressProps = {
  /** A stable label for the thing being executed (e.g., task name). */
  label: string;
  /** 0-100 percent complete. If omitted, progress is treated as indeterminate. */
  percent?: number;
  /** Optional short status text. */
  status?: ExecutionProgressStatus;
  /** Optional additional details (e.g., "3/10 steps"). */
  detail?: string;
};

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function statusColor(status: ExecutionProgressStatus | undefined) {
  switch (status) {
    case "succeeded":
      return "#16a34a";
    case "failed":
      return "#dc2626";
    case "canceled":
      return "#64748b";
    case "running":
      return "#2563eb";
    case "pending":
    default:
      return "#334155";
  }
}

export function ExecutionProgress({
  label,
  percent,
  status = "running",
  detail,
}: ExecutionProgressProps) {
  const isIndeterminate = percent === undefined;
  const clamped = percent === undefined ? undefined : clampPercent(percent);
  const color = statusColor(status);

  return (
    <section
      aria-label={`${label} execution progress`}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 12,
        background: "#ffffff",
        display: "grid",
        gap: 8,
      }}
    >
      <header style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <strong style={{ color: "#0f172a" }}>{label}</strong>
        <span style={{ color, fontSize: 12, textTransform: "uppercase" }}>
          {status}
        </span>
      </header>

      <div
        role="progressbar"
        aria-label="progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-valuetext={
          isIndeterminate
            ? "In progress"
            : `${clamped}%${detail ? ` (${detail})` : ""}`
        }
        style={{
          height: 10,
          background: "#e2e8f0",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: isIndeterminate ? "35%" : `${clamped}%`,
            background: color,
            borderRadius: 999,
            transition: "width 250ms ease",
            ...(isIndeterminate
              ? {
                  animation: "execprog-indeterminate 1.2s ease-in-out infinite",
                }
              : null),
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#475569", fontSize: 12 }}>
          {detail ?? (isIndeterminate ? "Working…" : "Progress")}
        </span>
        <span style={{ color: "#0f172a", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
          {isIndeterminate ? "—" : `${clamped}%`}
        </span>
      </div>

      <style>
        {`@keyframes execprog-indeterminate { 0% { transform: translateX(-30%); } 50% { transform: translateX(120%); } 100% { transform: translateX(-30%); } }`}
      </style>
    </section>
  );
}

