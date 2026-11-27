/**
 * End-to-end smoke test against a running dev server. Run: node scripts/smoke-api.mjs [baseUrl]
 * Logs in as the demo user (seed) and exercises health, transactions, analyze and categorize.
 * Env: DEMO_PASSWORD (default Demo@12345).
 */
const base = process.argv[2] ?? "http://localhost:3000";
const password = process.env.DEMO_PASSWORD ?? "Demo@12345";
const jar = new Map();

function remember(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    jar.set(pair.slice(0, i), pair.slice(i + 1));
  }
}
const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
async function call(path, init = {}) {
  const res = await fetch(base + path, { ...init, redirect: "manual", headers: { ...(init.headers ?? {}), cookie: cookie() } });
  remember(res);
  return res;
}

let failed = 0;
function check(name, ok, detail = "") {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
}

const health = await call("/api/health");
check("health", health.status === 200, `status=${health.status}`);

const unauth = await call("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
check("analyze requires login", unauth.status === 401, `status=${unauth.status}`);

const csrf = await (await call("/api/auth/csrf")).json();
const login = await call("/api/auth/callback/credentials", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ csrfToken: csrf.csrfToken, email: "demo@trustpay.ai", password, json: "true" }),
});
const session = await (await call("/api/auth/session")).json();
check("login as demo", Boolean(session?.user?.id), `login status=${login.status}`);

const tx = await call("/api/transactions?limit=5");
const txBody = tx.status === 200 ? await tx.json() : null;
check("list transactions", tx.status === 200 && txBody.total >= 50, `total=${txBody?.total}`);
check("transactions have categories", Boolean(txBody?.items?.some((t) => t.category)));

async function analyze(body) {
  const r = await call("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, json: await r.json().catch(() => null) };
}
const scam = await analyze({ type: "message", content: "Tài khoản sẽ bị khóa, gửi mã OTP ngay lập tức cho nhân viên", context: "pre_transfer" });
check("analyze scam message", scam.status === 200 && scam.json.level !== "safe", `level=${scam.json?.level} score=${scam.json?.score} model=${scam.json?.model}`);
const url = await analyze({ type: "url", content: "https://m0m0.vn.xyz/login" });
check("analyze phishing url", url.status === 200 && url.json.level === "high", `level=${url.json?.level} model=${url.json?.model}`);
const ok = await analyze({ type: "message", content: "Chiều nay đi cà phê nhé" });
check("analyze benign message", ok.status === 200 && ok.json.level === "safe", `level=${ok.json?.level} confidence=${ok.json?.confidence}`);
const bad = await analyze({ type: "message", content: "" });
check("analyze rejects empty content", bad.status === 400, `status=${bad.status}`);

const cat = await call("/api/transactions/categorize", { method: "POST" });
check("categorize endpoint", cat.status === 200, `status=${cat.status}`);

console.log(failed === 0 ? "\nAll smoke checks passed." : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
