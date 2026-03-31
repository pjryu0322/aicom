export type ExecutionStatus = "queued" | "running" | "succeeded" | "failed";

export type ExecutionError = {
  code: string;
  message: string;
};

export type ExecutionProgressState = {
  status: ExecutionStatus;
  startedAtMs?: number;
  finishedAtMs?: number;
  currentStep?: number;
  totalSteps?: number;
  percent?: number;
  message?: string;
  error?: ExecutionError | null;
};

