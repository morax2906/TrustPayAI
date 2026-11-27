import { isBedrockConfigured } from "@/lib/env";
import { analyzeHeuristic } from "./heuristic";
import { analyzeWithHaiku, bedrockSend, breakerOpen, recordResult, type Send } from "./llm";
import { analyzeResponseSchema, type AnalyzeRequest, type AnalyzeResponse } from "./schema";

/**
 * Entry point of the risk engine. The deterministic layer always runs. When Bedrock is
 * configured, Haiku aggregates and explains; any failure or timeout returns the heuristic result.
 */
export async function analyze(
  req: AnalyzeRequest,
  opts: { send?: Send; modelId?: string } = {}
): Promise<AnalyzeResponse> {
  const base = analyzeResponseSchema.parse(analyzeHeuristic(req));
  const modelId = opts.modelId ?? process.env.BEDROCK_MODEL_ID;
  const enabled = opts.send ? Boolean(modelId) : isBedrockConfigured();
  if (!enabled || !modelId || breakerOpen()) return base;

  try {
    const merged = await analyzeWithHaiku(req, base, modelId, opts.send ?? bedrockSend);
    recordResult(true);
    return analyzeResponseSchema.parse(merged);
  } catch {
    recordResult(false);
    return base;
  }
}
