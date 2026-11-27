import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { analyzeHeuristic } from "./heuristic";
import { analyzeRequestSchema } from "./schema";

type Sample = { id: string; type: string; label: "scam" | "safe"; content: string };
const samples = JSON.parse(readFileSync(new URL("../../../eval/samples.json", import.meta.url), "utf8")) as Sample[];

// Regression gate: every sample in eval/samples.json must get the expected verdict.
test("eval samples keep their expected verdicts", () => {
  const wrong: string[] = [];
  for (const s of samples) {
    const r = analyzeHeuristic(analyzeRequestSchema.parse({ type: s.type, content: s.content }));
    if ((r.level !== "safe") !== (s.label === "scam")) wrong.push(`${s.id} (score ${r.score})`);
  }
  assert.deepEqual(wrong, []);
});
