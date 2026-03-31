import React from "react";

export type ExecutionStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type ExecutionProgressProps = {
  status: ExecutionStatus;
  /**
   * 0..1 progress fraction. If omitted, progress is inferred from status.
   */
  progress?: number;
  /**
   * Optional human-readable stage label (e.g. "Downloading", "Evaluating").
   */
  label?: string;
  /**
   * Optional additional status detail (e.g. an error message).
   */
  detail?: string;
  /**
   * Optional counts to show "x / total".
   */
  completedSteps?: number;
  totalSteps?: number;
  className?: string;
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function inferredProgress(status: ExecutionStatus) {
  switch (status) {
    case "succeeded":
      return 1;
    case "failed":
    case "cancelled":
      return 1;
    case "running":
      return 0.2;
    case "queued":
    default:
      return 0;
  }
}

function statusLabel(status: ExecutionStatus) {
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

export function ExecutionProgress(props: ExecutionProgressProps) {
  const {
    status,
    progress,
    label,
    detail,
    completedSteps,
    totalSteps,
    className,
  } = props;

  const computed =
    typeof progress === "number" ? clamp01(progress) : inferredProgress(status);

  const percent = Math.round(computed * 100);

  const stepText =
    typeof completedSteps === "number" && typeof totalSteps === "number"
      ? `${completedSteps} / ${totalSteps}`
      : undefined;

  const ariaLabel =
    label ??
    (stepText
      ? `${statusLabel(status)} (${stepText})`
      : statusLabel(status));

  return (
    <div className={className} data-testid="execution-progress">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {label ?? "Execution"}
          </div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {statusLabel(status)}
            {stepText ? ` • ${stepText}` : ""}
            {detail ? ` • ${detail}` : ""}
          </div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{percent}%</div>
      </div>

      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        style={{
          height: 10,
          borderRadius: 999,
          background: "rgba(0,0,0,0.08)",
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            transition: "width 200ms ease",
            background:
              status === "failed"
                ? "#dc2626"
                : status === "cancelled"
                  ? "#6b7280"
                  : status === "succeeded"
                    ? "#16a34a"
                    : "#2563eb",
          }}
        />
      </div>
    </div>
  );
}

