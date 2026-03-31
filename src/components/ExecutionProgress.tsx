import React from "react";
import "./ExecutionProgress.css";

export type ExecutionStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function statusTone(status: ExecutionStatus): {
  fg: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case "queued":
      return { fg: "#1f2937", bg: "#f3f4f6", border: "#e5e7eb" };
    case "running":
      return { fg: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" };
    case "succeeded":
      return { fg: "#166534", bg: "#ecfdf5", border: "#a7f3d0" };
    case "failed":
      return { fg: "#991b1b", bg: "#fef2f2", border: "#fecaca" };
    case "cancelled":
      return { fg: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
  }
}

function statusLabel(status: ExecutionStatus): string {
  switch (status) {
    case "queued":
      return "Queued";
    case "running":
      return "Running";
    case "succeeded":
      return "Succeeded";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
  }
}

function ProgressSpinner({ title }: { title: string }) {
  return (
    <span
      aria-label={title}
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        border: "2px solid rgba(0,0,0,0.18)",
        borderTopColor: "rgba(0,0,0,0.55)",
        display: "inline-block",
        animation: "execprogress-spin 0.9s linear infinite",
      }}
    />
  );
}

export function ExecutionProgress({
  label = "Execution",
  status,
  percent,
  currentStep,
  totalSteps,
  compact = false,
}: {
  label?: string;
  status: ExecutionStatus;
  /**
   * 0..100 progress percent. Omit when unknown.
   */
  percent?: number;
  currentStep?: number;
  totalSteps?: number;
  compact?: boolean;
}) {
  const tone = statusTone(status);

  const hasSteps =
    typeof currentStep === "number" && typeof totalSteps === "number";
  const hasProgress = typeof percent === "number";
  const percentClamped = hasProgress
    ? Math.round(clamp01((percent as number) / 100) * 100)
    : undefined;

  const subtitleParts: string[] = [];
  if (hasSteps) subtitleParts.push(`${currentStep}/${totalSteps}`);
  if (percentClamped != null) subtitleParts.push(`${percentClamped}%`);
  const subtitle = subtitleParts.join(" • ");

  const showBar =
    !compact && (status === "running" || status === "queued" || hasProgress || hasSteps);
  const bar01 = hasProgress
    ? clamp01((percent as number) / 100)
    : hasSteps && (totalSteps as number) > 0
      ? clamp01((currentStep as number) / (totalSteps as number))
      : 0;

  const spinnerTitle = status === "running" ? "Running" : "Queued";

  return (
    <div
      aria-label="Execution progress"
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.fg,
        borderRadius: 12,
        padding: compact ? "8px 10px" : "10px 12px",
        display: "grid",
        gap: compact ? 6 : 8,
        minWidth: compact ? 220 : 320,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {(status === "running" || status === "queued") && (
              <ProgressSpinner title={spinnerTitle} />
            )}
            <span style={{ fontWeight: 650 }}>{label}</span>
          </div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.85,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span aria-label="Execution status">{statusLabel(status)}</span>
            {subtitle ? <span aria-label="Execution detail">{subtitle}</span> : null}
          </div>
        </div>

        <span
          aria-label="Execution badge"
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 999,
            border: `1px solid ${tone.border}`,
            background: "rgba(255,255,255,0.6)",
            color: tone.fg,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {statusLabel(status)}
        </span>
      </div>

      {showBar ? (
        <div style={{ display: "grid", gap: 6 }}>
          <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={hasProgress ? percentClamped : undefined}
            style={{
              height: 10,
              borderRadius: 999,
              background: "rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${hasProgress || hasSteps ? Math.round(clamp01(bar01) * 100) : 30}%`,
                background:
                  status === "failed"
                    ? "#ef4444"
                    : status === "succeeded"
                      ? "#22c55e"
                      : "#3b82f6",
                animation:
                  hasProgress || hasSteps ? undefined : "execprogress-indeterminate 1.1s ease-in-out infinite",
                transition: "width 220ms ease-out",
              }}
            />
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            {hasSteps
              ? `${currentStep}/${totalSteps}`
              : subtitle
                ? subtitle
                : status === "running"
                  ? "In progress"
                  : status === "queued"
                    ? "Queued"
                    : "Progress unavailable"}
          </div>
        </div>
      ) : null}
    </div>
  );
}

