import { z } from "zod";

export const AccountCreateRequestDtoSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(8).max(72),
  name: z.string().trim().min(1).max(100),
});

export type AccountCreateRequestDto = z.infer<typeof AccountCreateRequestDtoSchema>;

export type AccountCreateResponseDto = {
  accountId: string;
};

