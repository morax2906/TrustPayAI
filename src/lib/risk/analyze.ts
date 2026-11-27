import { analyzeHeuristic } from "./heuristic";
import { analyzeResponseSchema, type AnalyzeRequest, type AnalyzeResponse } from "./schema";

/**
 * Entry point of the risk engine. Today it runs the deterministic layer only.
 * The Haiku layer plugs in here (guarded by isBedrockConfigured, with a timeout and
 * fallback to the heuristic result) without changing the response contract.
 */
export async function analyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  return analyzeResponseSchema.parse(analyzeHeuristic(req));
}
