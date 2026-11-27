# Nhan — Backend/AI Lead: Task Checklist

Phạm vi: DB, auth, Risk Engine 2 lớp, Bedrock, Trust API, import/categorize, rate-limit, AWS/env.
Nguồn: `.kiro/steering/product.md`, `structure.md`, `tech.md`, `plan&idea/DEVELOPMENT_PLAN.md`.
Nguyên tắc: business logic ở `src/lib` (không nhét vào route handler/component); TypeScript strict, no `any`; lint + typecheck pass.

## D0 — 25/11 (chặn: làm ngay)
- [ ] Request quyền **AWS Bedrock** model **Claude 3.5 Haiku** (rủi ro cao nhất).
- [ ] Bật **AWS Budget Alarm $15** (tổng budget $20).
- [ ] Tạo AWS credentials, chốt region.
- [ ] Khởi tạo **Prisma + PostgreSQL (Supabase)**: `prisma/schema.prisma`.
- [ ] **Auth backend** (NextAuth email/password), session.
- [ ] Khung `src/lib/env` validate env vars (không hardcode secret).

## D1 — 26/11
- [ ] Transaction CRUD (logic ở `src/lib`).
- [ ] **CSV import parser + dedup** (`src/app/api/import`).
- [ ] Tạo **demo account** + seed data loader.
- [ ] Ghi env vars + API contract vào `README.md` (chống bus factor).
- [ ] `npx tsc --noEmit` + `npm run lint` pass.

## D2 — 27/11
- [ ] **Categorization** giao dịch (batch Haiku) + fallback rule-based khi Bedrock lỗi.

## D3 — 28/11
- [ ] Khung **Risk Engine 2 lớp** trong `src/lib/risk/`.
- [ ] **Report JSON schema** `{score, level, signals[], evidence[], recommendation, confidence}` + validate **zod**, reject off-schema.
- [ ] Viết **Technical FAQ** (10 câu).

## D4 — 29/11
- [ ] Lớp tất định: **punycode, typosquatting, domain age (RDAP, không có dữ liệu thì coi là unknown), bad TLDs, urgency keywords, sender mismatch, Google Safe Browsing**.
- [ ] Guardrail **anti-hallucination**: mỗi lý do trích signal/quote; thiếu evidence → hạ confidence.
- [ ] Guardrail **anti-prompt-injection**: system prompt tách biệt, wrap user content trong delimiter, coi input là data.
- [ ] **Circuit-breaker** Bedrock → fallback heuristics local.

## D5 — 30/11
- [ ] **Trust API `POST /api/analyze`** đúng contract `tech.md` (không đổi mà không báo Quyen + cập nhật README).
- [ ] **Rate limit** server-side: ~30 scan/ngày, 100 chat/ngày (chat chỉ single-turn về kết quả scan).
- [ ] Hỗ trợ `context: "pre_transfer"` cho mock MoMo của Quyen.
- [ ] Bổ sung Technical FAQ + rubric mapping.

## D6 — 1/12
- [ ] Import → dashboard **end-to-end**.
- [ ] Hoàn thiện seed loader.

## D7 — 2/12
- [ ] **Deploy prod** (Vercel + Supabase).
- [ ] `/api/health` + **cron ping** (chống Supabase free pause).
- [ ] Smoke test.
- [ ] Security pass: validate input at boundary, Prisma parameterized, không lộ stack trace, không log secret/user content.

## D8 — 3/12
- [ ] Fix cuối, hỗ trợ nộp.
- [ ] (D8→11/12) chỉ giám sát uptime, trả lời giám khảo; **không thêm feature**.

## Deliverables / eval
- [ ] README: env vars + Trust API contract.
- [ ] `eval/`: ground-truth scam samples + script **precision/recall** (phối hợp Quynh).
- [ ] Thêm **test prompt-injection** mỗi khi đổi risk logic.

## Phối hợp & rủi ro
- Với **Quyen**: chốt contract `/api/analyze` sớm (D0–D1); báo ngay nếu đổi.
- Với **Quynh**: nhận seed data + ground-truth eval (D0–D1); bàn giao Technical FAQ để pitch.
- Rủi ro: Bedrock access, Supabase pause, vượt $20 (`tech.md`: Haiku-only, chỉ log trên Vercel).
