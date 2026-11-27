/**
 * Precision/recall of the risk engine on eval/samples.json. Run: npm run eval
 * Positive class = "scam". An engine verdict counts as positive when level is "caution" or "high".
 * Reports the heuristic engine, which needs no network. Misses are listed so rules can be improved.
 * Note: samples were written alongside the rules, so treat the numbers as a regression check,
 * not as an estimate of real-world accuracy.
 */
import { readFileSync } from "node:fs";
import { analyzeHeuristic } from "../src/lib/risk/heuristic";
import { analyzeRequestSchema } from "../src/lib/risk/schema";

type Sample = { id: string; type: string; label: "scam" | "safe"; content: string };

const samples = JSON.parse(readFileSync(new URL("./samples.json", import.meta.url), "utf8")) as Sample[];

let tp = 0, fp = 0, fn = 0, tn = 0;
const errors: string[] = [];
for (const s of samples) {
  const req = analyzeRequestSchema.parse({ type: s.type, content: s.content });
  const r = analyzeHeuristic(req);
  const predicted = r.level !== "safe";
  const actual = s.label === "scam";
  if (predicted && actual) tp++;
  else if (predicted && !actual) { fp++; errors.push(`FALSE POSITIVE ${s.id} score=${r.score} signals=${r.signals.map((x) => x.code).join(",")}`); }
  else if (!predicted && actual) { fn++; errors.push(`MISSED ${s.id} score=${r.score}`); }
  else tn++;
}
const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
console.log(`samples=${samples.length} TP=${tp} FP=${fp} FN=${fn} TN=${tn}`);
console.log(`precision=${precision.toFixed(3)} recall=${recall.toFixed(3)}`);
for (const e of errors) console.log(e);
if (process.argv.includes("--strict") && (fp > 0 || fn > 0)) process.exit(1);
