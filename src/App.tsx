import { ExecutionProgress } from "./components/ExecutionProgress";

export function App() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginTop: 0 }}>Execution progress</h1>
      <div style={{ display: "grid", gap: 12, maxWidth: 640 }}>
        <ExecutionProgress label="Queued task" status="queued" currentStep={0} totalSteps={10} />
        <ExecutionProgress label="Running task" status="running" currentStep={3} totalSteps={10} />
        <ExecutionProgress label="Running task (percent)" status="running" percent={42} />
        <ExecutionProgress label="Succeeded task" status="succeeded" currentStep={10} totalSteps={10} />
        <ExecutionProgress label="Failed task" status="failed" currentStep={7} totalSteps={10} />
      </div>
    </div>
  );
}

