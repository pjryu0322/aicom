import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("POST /accounts", () => {
  it("creates an account and returns 201 + accountId", async () => {
    const app = createApp();

    const res = await request(app).post("/accounts").send({
      email: "user@example.com",
      password: "Str0ngP@ssw0rd!",
      name: "홍길동",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      accountId: expect.any(String),
    });
  });

  it("returns 409 when email already exists", async () => {
    const app = createApp();

    const payload = {
      email: "dup@example.com",
      password: "Str0ngP@ssw0rd!",
      name: "Jane",
    };

    await request(app).post("/accounts").send(payload).expect(201);
    const res = await request(app).post("/accounts").send(payload);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: {
        code: "CONFLICT",
        message: "Email already exists",
      },
    });
  });

  it("returns 400 for invalid input", async () => {
    const app = createApp();

    const res = await request(app).post("/accounts").send({
      email: "not-an-email",
      password: "short",
      name: "",
    });

    expect(res.status).toBe(400);
    expect(res.body?.error?.code).toBe("VALIDATION_ERROR");
    expect(res.body?.error?.message).toBe("Invalid request body");
  });
});

