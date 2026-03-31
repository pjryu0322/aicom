import { useMemo, useState } from "react";
import { ExecutionProgress } from "./components/ExecutionProgress";
import type { ExecutionProgressState } from "./types/execution";

function nowMs() {
  return Date.now();
}

export default function App() {
  const [state, setState] = useState<ExecutionProgressState>(() => ({
    status: "running",
    startedAtMs: nowMs(),
    currentStep: 0,
    totalSteps: 6,
    message: "Starting…",
  }));

  const derived = useMemo(() => {
    const total = state.totalSteps ?? 0;
    const current = state.currentStep ?? 0;
    const progress =
      total > 0 ? Math.min(100, Math.max(0, Math.round((current / total) * 100))) : state.percent ?? 0;
    return { progress };
  }, [state]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Execution progress</h1>
      <p style={{ marginTop: 8, color: "#444" }}>
        Demo UI to validate the <code>ExecutionProgress</code> component.
      </p>

      <div style={{ maxWidth: 720, marginTop: 16 }}>
        <ExecutionProgress
          label="Sample task execution"
          percent={derived.progress}
          status={state.status === "queued" ? "pending" : state.status === "failed" ? "failed" : "running"}
          detail={
            state.totalSteps
              ? `${state.currentStep ?? 0} / ${state.totalSteps} steps${state.message ? ` · ${state.message}` : ""}`
              : state.message
          }
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              status: "running",
              startedAtMs: s.startedAtMs ?? nowMs(),
              currentStep: Math.min((s.currentStep ?? 0) + 1, s.totalSteps ?? 0),
              message: `Step ${Math.min((s.currentStep ?? 0) + 1, s.totalSteps ?? 0)}…`,
            }))
          }
        >
          Next step
        </button>
        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              status: "queued",
              message: "Queued…",
            }))
          }
        >
          Queued
        </button>
        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              status: "running",
              message: "Running…",
            }))
          }
        >
          Running
        </button>
        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              status: "succeeded",
              finishedAtMs: nowMs(),
              message: "Done",
            }))
          }
        >
          Succeeded
        </button>
        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              status: "failed",
              finishedAtMs: nowMs(),
              message: "Failed: timed out",
              error: { code: "TIMEOUT", message: "Timed out waiting for worker" },
            }))
          }
        >
          Failed
        </button>
        <button
          type="button"
          onClick={() =>
            setState({
              status: "running",
              startedAtMs: nowMs(),
              currentStep: 0,
              totalSteps: 6,
              message: "Restarting…",
            })
          }
        >
          Reset
        </button>
      </div>

      <p style={{ marginTop: 16, color: "#666", fontSize: 12 }}>
        Derived progress: <strong>{derived.progress}%</strong>
      </p>
    </div>
  );
}

