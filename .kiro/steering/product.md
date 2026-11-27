# TrustPay AI: Product

Personal AI financial guardian. Tagline: "Think Before You Trust. Think Before You Pay."
Competition entry (Vietnam). Submission 03/12/2026, finals 11/12/2026. The live URL must stay up about 16 days after submission.

## Pillars
- **Protect My Money (the core).** Scam detection for messages, URLs and image text, with explainable reports.
- **Manage My Money (illustrative only).** CSV import, categorization, basic dashboard.

The Trust Layer is the product. Personal finance management (PFM) only needs to be good enough to demonstrate it.

## Judging criteria
Human-Centered, AI-Powered, Technical Execution, Feasibility & Business Impact. Map features to these in `RUBRIC_MAPPING.md`.

## MVP scope (P0, locked)
- Auth plus a demo account (email/password)
- Message Scanner, URL Scanner, Risk Engine, Explainable Report
- Trust Risk API `POST /api/analyze` and a mock MoMo pre-transfer screen
- CSV import, transaction list, categorization, basic dashboard (total income/expense, by category)
- Seed data, rate limiting, `/api/health`, deploy
- Static pages: Landing, How to try in 60s, About, Privacy/Data Policy

## Out of scope (roadmap v2, do not build)
OCR/image scan, multi-purpose AI assistant, budget/spending alerts, anomaly detection, savings goals, recurring transactions, Gmail monitoring, SES email alerts. Chat is limited to single-turn questions about a scan result.
Any new feature goes to the roadmap, not the MVP.

## Product rules
- Human-in-the-loop: the AI never moves money or transfers funds. The mock MoMo screen must show: "Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản."
- User controls data: explicit consent, revocable access, minimal storage.
- Every risk finding must be explainable: cite the signal and the source text.
- Low evidence means low confidence. Never fabricate certainty.
- Reference law: Nghị định 13/2023 (personal data protection).
- User-facing copy is Vietnamese by default.

## Team and ownership
- Nhan: backend/AI (DB, auth, risk engine, Bedrock, Trust API, import/categorize, rate limit, AWS/env)
- Quyen: frontend (UI shell, scanner/report, dashboard, transactions, mock MoMo, Vercel deploy)
- Quynh: pitching, product, QA, static pages only. Do not edit auth, scan, dashboard or API code.

Plans live in `plan&idea/` (`DEVELOPMENT_PLAN.md`, `TrustPay_AI_Proposal.md`). Check them before adding scope.
