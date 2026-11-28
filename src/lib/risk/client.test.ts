import test from "node:test";
import assert from "node:assert/strict";
import {
  appendScanHistory,
  getLevelPresentation,
  mapAnalyzeError,
  requestRiskAnalysis,
  type ScanHistoryItem,
} from "./client";

test("getLevelPresentation never claims absolute safety for safe level", () => {
  const safe = getLevelPresentation("safe");
  assert.doesNotMatch(safe.label, /an toàn tuyệt đối|100%/i);
  assert.match(safe.label, /Chưa thấy dấu hiệu/i);

  const high = getLevelPresentation("high");
  assert.equal(high.variant, "high");
});

test("mapAnalyzeError returns localized 429 daily limit message", () => {
  const msg429 = mapAnalyzeError(429, "rate_limited");
  assert.match(msg429, /30 lượt quét/);
  assert.match(msg429, /giờ Việt Nam/);

  const msg401 = mapAnalyzeError(401, "unauthorized");
  assert.match(msg401, /đăng nhập/i);
});

test("requestRiskAnalysis posts the payload and maps API errors", async () => {
  const originalFetch = globalThis.fetch;
  const request = { type: "url" as const, content: "https://example.com" };
  let postedUrl = "";
  let postedBody = "";

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    postedUrl = String(input);
    postedBody = String(init?.body);
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  try {
    await assert.rejects(
      requestRiskAnalysis(request, "network error"),
      /30 lượt quét trong ngày hôm nay/
    );
    assert.equal(postedUrl, "/api/analyze");
    assert.deepEqual(JSON.parse(postedBody), request);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("appendScanHistory prepends new item and caps history length", () => {
  const existing: ScanHistoryItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: `id-${i}`,
    createdAt: "2026-11-28T00:00:00.000Z",
    request: { type: "message", content: `msg ${i}` },
    response: {
      score: 5,
      level: "safe",
      signals: [],
      recommendation: "Ok",
      confidence: 0.4,
      model: "heuristic",
    },
  }));
  const next = appendScanHistory(
    existing,
    {
      id: "newest",
      createdAt: "2026-11-28T01:00:00.000Z",
      request: { type: "url", content: "https://example.com" },
      response: {
        score: 75,
        level: "high",
        signals: [{ code: "bad_tld", label: "Bad TLD", evidence: ".xyz" }],
        recommendation: "Stop",
        confidence: 0.85,
        model: "heuristic",
      },
    },
    10
  );
  assert.equal(next.length, 10);
  assert.equal(next[0].id, "newest");
  assert.equal(next[9].id, "id-8");
});
