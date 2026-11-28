import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(100).optional(),
  // Explicit consent is required (Nghi dinh 13/2023).
  consent: z.literal(true),
});

export type RegisterResult = { ok: true } | { ok: false; reason: "exists" };

export async function registerUser(input: z.infer<typeof registerSchema>): Promise<RegisterResult> {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) return { ok: false, reason: "exists" };
  const passwordHash = await bcrypt.hash(input.password, 10);
  await db.user.create({
    data: { email: input.email, name: input.name, passwordHash, consentAt: new Date() },
  });
  return { ok: true };
}
