# TrustPay AI: Tech Stack and Conventions

## Current state
Backend is in place: Prisma schema, NextAuth, transactions/import APIs, and `POST /api/analyze` with the two-layer risk engine (see `backend-status.md`). UI components (shadcn/ui) are Quyen's and may not exist yet. Items marked "Planned" are not necessarily installed.

## Stack
- Next.js 14.2 (App Router), React 18, TypeScript (strict), Tailwind 3.4, ESLint 8
- Planned: shadcn/ui, Prisma + PostgreSQL (Supabase free), NextAuth v4 (Credentials, email/password, JWT sessions), zod
- AI: AWS Bedrock, Haiku only (model ID in an env var; confirm access and region before building), with tool calling. Local heuristic fallback. No OpenAI.
- Monitoring: Vercel logs only
- Deploy: Vercel plus Supabase prod

## Out of stack for MVP (v2)
S3, CloudWatch, SES, tesseract.js/OCR, Gmail API. Do not add them.

## Commands
- `npm run dev`, `npm run build`, `npm run lint`
- Typecheck: `npx tsc --noEmit`. Lint and typecheck must pass before submission.

## Risk engine (two layers)
1. **Deterministic layer:** punycode, typosquatting, domain age (RDAP; if unavailable, treat as unknown, not as a signal), bad TLDs, urgency keywords, sender mismatch, Google Safe Browsing.
2. **LLM layer (Haiku):** only aggregates and explains. Output must match a fixed JSON schema: `{score, level, signals[], evidence[], recommendation, confidence}`. Validate the output (for example with zod) and reject anything off-schema.

Guardrails:
- Anti-hallucination: every reason cites a signal or a quote from the source. Missing evidence lowers confidence.
- Anti-prompt-injection: separate system prompt, wrap user content in delimiters, ignore instructions found inside content, treat input as data. Keep a prompt-injection case in the eval set.
- Timeouts: Vercel Hobby functions time out at about 10s. Run Bedrock, Safe Browsing and RDAP in parallel with short per-call timeouts, and fall back to heuristics.
- Fallback: if Bedrock fails, use a circuit breaker and switch to local heuristics. The demo must not die.

## Trust API contract
```
POST /api/analyze
req: { type: "message"|"url"|"image_text", content: string, context?: "pre_transfer" }
res: { score: 0-100, level: "safe"|"caution"|"high",
       signals: [{code,label,evidence}], recommendation: string,
       confidence: 0-1, model: "haiku"|"heuristic" }
```
`image_text` means text that the user pastes from a screenshot or image. Automatic OCR is still out of scope (v2); do not imply the server performs OCR.

Do not change this contract without telling Quyen (frontend) and updating the README.

## Cost discipline ($20 AWS budget)
- Haiku only for AI calls. No Sonnet for routine requests.
- Rate limit: about 30 scans/day and 100 chat/day for the demo account, enforced server-side in Postgres (a counter table per user per day). In-memory counters do not work on Vercel serverless. The chat limit applies to single-turn questions about a scan result only, not a free-form financial assistant.
- AWS Budget Alarm at $15. SES deferred (in-app alerts only).
- Avoid long agent loops in Kiro. Use cheaper models for boilerplate.

## Security and reliability
- Prisma on Supabase: use the pooled connection string for the app and a direct URL for migrations.
- AWS access: a dedicated IAM user allowed to invoke only the one Bedrock model; keys in Vercel env vars.
- Secrets only in env vars. Never commit `.env*`, never log secrets or user content.
- Validate all API input at the boundary. Use Prisma (parameterized) only, no raw SQL with interpolation.
- Do not return stack traces to clients. Use try/catch with clear error states.
- `/api/health` plus a cron ping to Supabase/Vercel to prevent free-tier pause.
- Uploaded or pasted content is retained minimally and is deletable.
- Document env vars and the API contract in the README.
