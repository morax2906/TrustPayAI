# TrustPay AI

**Your Personal AI Financial Guardian** — Think Before You Trust. Think Before You Pay.

Dự án tham gia cuộc thi (Việt Nam). Lõi sản phẩm là **Trust Layer**: phát hiện lừa đảo từ tin nhắn, URL và văn bản, kèm báo cáo có thể giải thích. Quản lý tài chính cá nhân (PFM) chỉ ở mức minh họa.

## Trạng thái

| Hạng mục | Trạng thái |
|---|---|
| Prisma schema, auth (email/password), `/api/health` | Xong |
| Giao dịch: CRUD, import CSV, dedup, seed demo | Xong (chưa kiểm thử với DB thật) |
| Phân loại giao dịch (Haiku + fallback) | Chưa làm (D2) |
| Risk Engine, `POST /api/analyze`, rate limit | Chưa làm (D3 đến D5) |
| UI, trang tĩnh | Frontend (Quyen) và trang tĩnh (Quynh) |

## Thử trong 60 giây

1. `npm install` (tự chạy `prisma generate`)
2. Copy `.env.example` thành `.env.local` và điền giá trị (xem [Biến môi trường](#biến-môi-trường))
3. `npx prisma migrate dev` rồi `npm run db:seed`
4. `npm run dev` → mở http://localhost:3000
5. Đăng nhập bằng **tài khoản demo**: `demo@trustpay.ai` / `Demo@12345` (đặt lại bằng biến `DEMO_PASSWORD` khi seed)
6. Luồng thử: dán một tin nhắn/URL đáng ngờ → xem báo cáo rủi ro → thử màn hình MoMo mô phỏng (pre-transfer).

## Stack

- Next.js 14.2 (App Router), React 18, TypeScript (strict), Tailwind 3.4, ESLint 8
- Prisma 6 + PostgreSQL (Supabase), NextAuth v4 (Credentials, JWT session), zod
- AI: AWS Bedrock (chỉ Haiku, model ID trong env) + tool calling; fallback heuristics local, không dùng OpenAI
- Deploy: Vercel + Supabase
- Dự kiến: shadcn/ui

## Lệnh

```bash
npm run dev            # dev server
npm run build          # production build
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # unit test (node:test qua tsx)
npm run db:migrate     # prisma migrate dev
npm run db:seed        # danh mục + tài khoản demo + 50 giao dịch
npm run smoke:bedrock  # kiểm tra truy cập Bedrock (cần biến AWS trong .env.local)
```

Lint và typecheck phải pass trước khi nộp.

## Biến môi trường

Khai báo trong `.env.local` (không commit `.env*`). Mẫu ở `.env.example`. Biến được kiểm tra bằng zod trong `src/lib/env.ts`.

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL qua pooler (Supabase, cổng 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Có (khi migrate) | Chuỗi kết nối trực tiếp (cổng 5432), dùng cho migration |
| `NEXTAUTH_SECRET` | Có | Secret ký session, tối thiểu 16 ký tự |
| `NEXTAUTH_URL` | Có ở production | Base URL của app (vd `http://localhost:3000`) |
| `AWS_REGION` | Không | Region Bedrock |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Không | Credentials của IAM user chỉ được invoke một model Bedrock |
| `BEDROCK_MODEL_ID` | Không | ID model Haiku (hoặc inference profile ID) |
| `SAFE_BROWSING_API_KEY` | Không | Key Google Safe Browsing |
| `DEMO_PASSWORD` | Không | Mật khẩu tài khoản demo khi seed (mặc định `Demo@12345`) |

Thiếu cấu hình AWS thì Risk Engine dùng heuristics local (`model: "heuristic"`).

## Trust API contract

```
POST /api/analyze
req:  { type: "message"|"url"|"image_text", content: string, context?: "pre_transfer" }
res:  { score: 0-100, level: "safe"|"caution"|"high",
        signals: [{code, label, evidence}], recommendation: string,
        confidence: 0-1, model: "haiku"|"heuristic" }
```

- `content` dài tối đa 5000 ký tự.
- `image_text` là văn bản người dùng dán từ ảnh chụp màn hình. Server **không** tự OCR (OCR là v2).
- `level` theo `score`: từ 70 là `high`, từ 35 là `caution`, dưới 35 là `safe` (ngưỡng tạm, có thể chỉnh).
- Schema zod nằm ở `src/lib/risk/schema.ts`. Endpoint đã chạy (hiện chỉ có engine heuristic, `model` luôn là `"heuristic"`; lớp Haiku thêm sau mà không đổi contract).
- Yêu cầu đăng nhập (cookie session). `signals[].evidence` trích đoạn trong nội dung hoặc mô tả dữ kiện (vd. tên miền). `signals` rỗng nghĩa là chưa thấy dấu hiệu, và `confidence` sẽ thấp (khoảng 0.4). UI không nên hiển thị "an toàn tuyệt đối".
- Giới hạn 30 lần quét mỗi người mỗi ngày (giờ Việt Nam).
- Lỗi:

| HTTP | `error` | Khi nào |
|---|---|---|
| 400 | `invalid_json` | Body không phải JSON |
| 400 | `invalid_input` | Sai `type`, `content` rỗng hoặc dài hơn 5000 ký tự, `context` khác `pre_transfer` |
| 401 | `unauthorized` | Chưa đăng nhập |
| 429 | `rate_limited` | Quá 30 lần quét trong ngày |
| 500 | `server_error` | Lỗi server |

Ví dụ:

```
POST /api/analyze
{ "type": "message", "content": "Tài khoản sẽ bị khóa, gửi mã OTP ngay lập tức", "context": "pre_transfer" }

200
{ "score": 65, "level": "caution",
  "signals": [
    { "code": "otp_request", "label": "Yêu cầu cung cấp mã OTP / mã xác thực", "evidence": "OTP" },
    { "code": "urgency", "label": "Tạo áp lực phải hành động gấp", "evidence": "sẽ bị khóa" },
    { "code": "pre_transfer_context", "label": "...", "evidence": "..." } ],
  "recommendation": "Tạm dừng chuyển tiền và xác minh người nhận qua kênh khác ...", "confidence": 0.8, "model": "heuristic" }
```

- Không đổi contract mà không thông báo frontend và cập nhật README này.

## API đã có

Mọi endpoint ngoài `/api/health` và `/api/auth/*` yêu cầu đăng nhập (cookie session NextAuth). Lỗi trả `{ "error": "<mã>" }`, không kèm stack trace.

### `GET /api/health`
`200 {"status":"ok","db":"up"}` hoặc `503 {"status":"degraded","db":"down"}`.

### `POST /api/auth/register`
```
req: { email, password (8-128 ký tự), name?, consent: true }
res: 201 { ok: true } | 400 invalid_input | 409 email_exists
```
`consent` phải là `true` (đồng ý xử lý dữ liệu theo Nghị định 13/2023). Đăng nhập dùng NextAuth: `POST /api/auth/callback/credentials` hoặc `signIn("credentials")` ở client.

### `GET /api/transactions`
Query (tùy chọn): `page` (mặc định 1), `limit` (1-100, mặc định 20), `type` (`income`|`expense`), `from`, `to` (`YYYY-MM-DD`).
```
res: { items: [{ id, date, amount, type, description, category: {slug, name} | null }],
       total, page, limit }
```
`amount` là số nguyên VND dương, hướng thu/chi nằm ở `type`.

### `POST /api/transactions`
```
req: { date: "YYYY-MM-DD", type: "income"|"expense", amount: số nguyên dương, description }
res: 201 { id } | 400 invalid_input | 409 duplicate
```

### `DELETE /api/transactions/[id]`
`200 { ok: true }` hoặc `404 not_found`. Chỉ xóa được giao dịch của chính người dùng.

### `POST /api/import`
`multipart/form-data`, trường `file` (CSV, tối đa 1 MB và 2000 dòng).
```
res: { totalRows, imported, duplicates, errors: [{line, reason}] (tối đa 20), errorCount }
     | 413 file_too_large | 422 invalid_format {message}
```
CSV cần cột ngày, nội dung, và số tiền (một cột có dấu, hoặc hai cột ghi nợ/ghi có). Tên cột tiếng Việt hoặc tiếng Anh đều được. Ngày dạng `yyyy-MM-dd` hoặc `dd/MM/yyyy`. Hỗ trợ BOM và dấu phân cách `,` `;` tab. Import lại cùng một file không tạo bản ghi trùng.

## Cấu trúc code

```
prisma/schema.prisma        User, Category, Transaction, ScanHistory, ApiUsage
prisma/seed.ts              Danh mục, tài khoản demo, 50 giao dịch
scripts/bedrock-smoke.ts    Kiểm tra truy cập Bedrock
src/lib/env.ts              Kiểm tra biến môi trường
src/lib/auth.ts             Cấu hình NextAuth
src/lib/transactions/       Parse CSV, chuẩn hóa, dedup, service
src/lib/risk/schema.ts      Schema contract của /api/analyze
src/app/api/                Route handler (chỉ validate, gọi lib, trả JSON)
```

## Phạm vi MVP

- Auth + demo account
- Message Scanner, URL Scanner, Risk Engine, Explainable Report
- Trust Risk API + màn hình MoMo pre-transfer (mô phỏng)
- CSV import, transaction list, categorization, dashboard cơ bản
- Seed data, rate limit, `/api/health`, deploy
- Trang tĩnh: Landing, How to try in 60s, About, Privacy/Data Policy

**Hạn chế và roadmap v2:** OCR/image scan, trợ lý AI tài chính đa mục đích, budget/spending alerts, anomaly detection, savings goals, giao dịch định kỳ, Gmail monitoring, SES alerts. Chat chỉ single-turn về kết quả scan.

## Nguyên tắc

- Human-in-the-loop: AI không bao giờ tự chuyển tiền. Màn hình MoMo ghi rõ: "Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản."
- Mọi kết quả rủi ro phải giải thích được (trích tín hiệu/nguồn). Thiếu bằng chứng thì confidence thấp.
- Dữ liệu tối thiểu, có sự đồng ý rõ ràng, có thể thu hồi/xóa. Tham chiếu Nghị định 13/2023/NĐ-CP.

## Tài liệu nội bộ

- `.kiro/steering/`: nguồn chính thức cho product, structure, tech.
- `docs/NHAN_TASKS.md`, `docs/NHAN_SETUP_CHECKLIST.md`: việc của backend lead.
- `plan&idea/`: kế hoạch vận hành (local, không commit).
- `docs/archive/`: tài liệu lịch sử, không phải phạm vi build.
