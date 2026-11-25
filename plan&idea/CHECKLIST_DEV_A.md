# Checklist — Dev A (Backend/AI Lead)

> Bối cảnh: 25/11 → nộp 03/12/2026 (8 ngày). Huấn luyện theo `DEVELOPMENT_PLAN.md`.

## Phase 0 — Hôm nay (25/11, chặn tiến độ)
- [ ] **Request Bedrock model access** Claude 3.5 Haiku (region dùng, vd `us-east-1`) — rủi ro trễ nhất
- [ ] IAM user least-privilege: `bedrock:InvokeModel`, `s3:*` (bucket của bạn); tạo access key
- [ ] **AWS Budget Alarm $15** + email cảnh báo billing
- [ ] Tạo S3 bucket + lifecycle rule xóa sau 1 ngày
- [ ] Smoke test gọi Haiku bằng script (xác nhận chạy trước khi build)
- [ ] Cài deps: `prisma @prisma/client next-auth zod bcryptjs @aws-sdk/client-bedrock-runtime @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
- [ ] `.env.example` + `.env.local` (DATABASE_URL, NEXTAUTH_SECRET, AWS_*, AWS_REGION, BEDROCK_MODEL_ID)
- [ ] Supabase project → `DATABASE_URL` → `prisma init` + migration đầu tiên
- [ ] **Prisma schema:** `User`, NextAuth tables (`Account/Session/VerificationToken`), `Transaction`, `Category`, `ScanHistory`, `ApiUsage` (rate-limit), `Budget` (optional)
- [ ] `GET /api/health`
- [ ] **Freeze API contract** `POST /api/analyze` → gửi Dev B/C duyệt (unblock FE)

## Phase 1 — D1 (26/11): Transaction Core
- [ ] Transaction CRUD + validation (zod)
- [ ] CSV bank statement parser + chuẩn hóa ngày/tiền/nội dung
- [ ] Dedup logic (hash theo thời gian + số tiền + nội dung)
- **DoD:** import CSV + CRUD chạy local, test tay OK

## Phase 2 — D2 (27/11): Categorization
- [ ] Bedrock tool `categorize_transaction` (batch Haiku, JSON schema cố định)
- [ ] Auto-categorize khi import
- [ ] Fallback keyword mapping nếu Bedrock lỗi
- **DoD:** import → giao dịch có danh mục (Aha #1, phối hợp Dev B)

## Phase 3 — D3 (28/11): Risk Engine (lõi)
- [ ] Risk Engine 2 lớp: score 0–100 + level (`safe|caution|high`) + `confidence`
- [ ] JSON schema: `{score, level, signals[], evidence[], recommendation, confidence}`
- [ ] LLM chỉ giải thích/tổng hợp; mỗi lý do phải trích evidence gốc
- [ ] Viết **Technical FAQ 10 câu** cho Dev C
- **DoD:** paste SMS/URL → report có lý do + khuyến nghị

## Phase 4 — D4 (29/11): Lớp tất định + Guardrails
- [ ] Heuristics: punycode, typosquatting, TLD xấu, urgency keywords, sender mismatch
- [ ] WHOIS tuổi domain + Google Safe Browsing API (free)
- [ ] Chống prompt injection: system prompt tách biệt, delimiter, bỏ qua mệnh lệnh trong input
- [ ] Fallback heuristics khi Bedrock fail (circuit-breaker)
- **DoD:** eval set (Dev C) chạy được, có Precision/Recall

## Phase 5 — D5 (30/11): Trust API + Rate Limit
- [ ] Hoàn chỉnh `POST /api/analyze` (message/url/image_text + `context:"pre_transfer"`)
- [ ] Rate-limit ẩn cứng: ~30 scan/ngày, 100 chat/ngày per demo account (`ApiUsage`)
- [ ] Ghi audit scan vào `ScanHistory`
- **DoD:** Dev B nối mock MoMo end-to-end

## Phase 6 — D6 (1/12): End-to-end
- [ ] Import → categorize → dashboard đúng số liệu
- [ ] Seed loader (50 giao dịch + 6–8 mẫu lừa đảo)
- [ ] Fix bug từ QA Dev C

## Phase 7 — D7 (2/12): Deploy & Stability
- [ ] Env prod (Vercel + Supabase) + AWS keys trên Vercel
- [ ] `/api/health` + cron keep-alive Supabase/Vercel
- [ ] Smoke test live: auth, scan, import, dashboard, mock MoMo
- [ ] CloudWatch log retention 1 ngày; chỉ log lỗi
- [ ] Xác nhận spend AWS còn dư địa

## Phase 8 — D8 (3/12): Buffer
- [ ] Fix cuối, đảm bảo lint/typecheck pass
- [ ] Có mặt backup Q&A cùng Dev C

## Cross-cutting (làm suốt)
- [ ] Zod validate mọi API input; error không lộ stack trace
- [ ] Haiku-only; cấm Sonnet cho request thường
- [ ] API contract + env ghi README (chống bus factor)
- [ ] Chỉ commit khi được yêu cầu; giữ nhánh feature + PR

**Chặn ngay:** Bedrock access + Prisma schema + API contract.
