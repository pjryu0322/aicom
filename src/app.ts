import express from "express";
import { ZodError } from "zod";
import { accountsRouter } from "./accounts/router.js";
import { HttpError } from "./errors.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/accounts", accountsRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({
        error: {
          code: err.code,
          message: err.message,
        },
      });
    }

    if (err instanceof ZodError) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: err.flatten(),
        },
      });
    }

    if (err instanceof Error) {
      return res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        },
      });
    }

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      },
    });
  });

  return app;
}

