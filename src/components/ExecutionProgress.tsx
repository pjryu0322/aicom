import React from "react";

export type ExecutionStatus = "pending" | "running" | "success" | "error";

export interface ExecutionProgressProps {
  /** Human readable name of the task or execution. */
  label?: string;
  /** Current progress in percent \[0, 100]. */
  percent?: number;
  /** Current status of the execution. */
  status?: ExecutionStatus;
  /** Optional short detail text (e.g. current step). */
  detail?: string;
  /** When true, renders a more compact, inline layout. */
  compact?: boolean;
}

const clampPercent = (value: number | undefined): number => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
};

const statusLabel: Record<ExecutionStatus, string> = {
  pending: "대기 중",
  running: "실행 중",
  success: "완료",
  error: "오류",
};

const statusColor: Record<ExecutionStatus, string> = {
  pending: "#CBD5E1", // slate-300
  running: "#3B82F6", // blue-500
  success: "#22C55E", // green-500
  error: "#EF4444", // red-500
};

const statusBackground: Record<ExecutionStatus, string> = {
  pending: "#E5E7EB", // gray-200
  running: "#DBEAFE", // blue-100
  success: "#DCFCE7", // green-100
  error: "#FEE2E2", // red-100
};

export const ExecutionProgress: React.FC<ExecutionProgressProps> = ({
  label = "실행 상태",
  percent,
  status = "pending",
  detail,
  compact = false,
}) => {
  const safePercent = clampPercent(percent);
  const showBar = status === "running" || typeof percent === "number";

  const containerStyle: React.CSSProperties = {
    borderRadius: 8,
    padding: compact ? "4px 8px" : "8px 12px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: compact ? "row" : "column",
    alignItems: compact ? "center" : "stretch",
    gap: compact ? 8 : 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: compact ? 12 : 13,
  };

  const metaRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 500,
    color: "#0F172A",
  };

  const statusPillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: 999,
    backgroundColor: statusBackground[status],
    color: statusColor[status],
    fontSize: 11,
    fontWeight: 600,
  };

  const percentTextStyle: React.CSSProperties = {
    marginLeft: 6,
    fontVariantNumeric: "tabular-nums",
  };

  const barTrackStyle: React.CSSProperties = {
    position: "relative",
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  };

  const barFillStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: `${safePercent}%`,
    backgroundColor: statusColor[status],
    transition: "width 160ms ease-out",
  };

  const detailStyle: React.CSSProperties = {
    marginTop: compact ? 0 : 4,
    color: "#6B7280",
    fontSize: 12,
  };

  return (
    <section
      aria-label={label}
      aria-live="polite"
      style={containerStyle}
      data-testid="execution-progress"
    >
      <div style={metaRowStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={labelStyle}>{label}</span>
          {typeof percent === "number" && (
            <span style={{ ...detailStyle, marginTop: 0 }}>
              {safePercent}
              <span style={percentTextStyle}>%</span>
            </span>
          )}
        </div>
        <div style={statusPillStyle}>{statusLabel[status]}</div>
      </div>

      {showBar && (
        <div
          style={{
            marginTop: compact ? 0 : 6,
            width: "100%",
          }}
        >
          <div style={barTrackStyle}>
            <div style={barFillStyle} />
          </div>
        </div>
      )}

      {detail && !compact && <div style={detailStyle}>{detail}</div>}
    </section>
  );
};

