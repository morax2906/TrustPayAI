import { z } from "zod";

/** Request body of POST /api/analyze. */
export const analyzeRequestSchema = z.object({
  type: z.enum(["message", "url", "image_text"]),
  content: z.string().trim().min(1).max(5000),
  context: z.literal("pre_transfer").optional(),
});
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const signalSchema = z.object({
  code: z.string().min(1).max(64),
  label: z.string().min(1).max(200),
  // Quote from the source text or a factual finding that supports the signal.
  evidence: z.string().min(1).max(500),
});
export type Signal = z.infer<typeof signalSchema>;

export const levelSchema = z.enum(["safe", "caution", "high"]);
export type Level = z.infer<typeof levelSchema>;

/** Response body of POST /api/analyze. Frozen contract, see README. */
export const analyzeResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  level: levelSchema,
  signals: z.array(signalSchema).max(20),
  recommendation: z.string().min(1).max(1000),
  confidence: z.number().min(0).max(1),
  model: z.enum(["haiku", "heuristic"]),
});
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;

/** Shape the LLM layer must return. `evidence` lists quotes used; `model` is added by the server. */
export const llmOutputSchema = analyzeResponseSchema
  .omit({ model: true })
  .extend({ evidence: z.array(z.string().max(500)).max(20) })
  .strict();
export type LlmOutput = z.infer<typeof llmOutputSchema>;

export function levelFromScore(score: number): Level {
  if (score >= 70) return "high";
  if (score >= 35) return "caution";
  return "safe";
}
