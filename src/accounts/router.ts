import { Router } from "express";
import { z } from "zod";
import { AccountCreateRequestDtoSchema, type AccountCreateResponseDto } from "./dto.js";
import { createAccount } from "./service.js";
import { HttpError } from "../errors.js";

export const accountsRouter = Router();

const BodySchema = AccountCreateRequestDtoSchema;

accountsRouter.post("/", async (req, res, next) => {
  try {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "VALIDATION_ERROR", "Invalid request body");
    }

    const result = await createAccount(parsed.data);
    const response: AccountCreateResponseDto = { accountId: result.accountId };
    return res.status(201).json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new HttpError(400, "VALIDATION_ERROR", "Invalid request body"));
    }
    return next(err);
  }
});

