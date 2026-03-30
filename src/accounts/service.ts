import { randomUUID } from "node:crypto";
import { HttpError } from "../errors.js";

export type CreateAccountInput = {
  email: string;
  password: string;
  name: string;
};

export type CreateAccountResult = {
  accountId: string;
};

type AccountRecord = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
};

// In-memory persistence for this repository's current scope (no DB yet).
const accountsByEmail = new Map<string, AccountRecord>();

function hashPassword(password: string): string {
  // Minimal placeholder hash for demo/testing. Replace with bcrypt/argon2 when a DB is added.
  return `sha256:${Buffer.from(password).toString("base64")}`;
}

export function createAccount(input: CreateAccountInput): CreateAccountResult {
  const existing = accountsByEmail.get(input.email);
  if (existing) {
    throw new HttpError(409, "CONFLICT", "Email already exists");
  }

  const accountId = randomUUID();
  const record: AccountRecord = {
    id: accountId,
    email: input.email,
    passwordHash: hashPassword(input.password),
    name: input.name,
    createdAt: new Date().toISOString(),
  };
  accountsByEmail.set(input.email, record);
  return { accountId };
}

export function __resetAccountsForTests() {
  accountsByEmail.clear();
}
