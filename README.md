# TrustPay AI

**Your Personal AI Financial Guardian** — Think Before You Trust. Think Before You Pay.

Gợi ý dự án tham gia cuộc thi (Việt Nam). Lõi sản phẩm là **Trust Layer**: phát hiện lừa đảo từ tin nhắn, URL và văn bản, kèm báo cáo có thể giải thích. Quản lý tài chính cá nhân (PFM) chỉ ở mức minh họa.

> Trạng thái: đây là skeleton `create-next-app`. Prisma, auth, API routes và UI components **chưa được thêm** (xem `.kiro/steering/tech.md`).

## Thử trong 60 giây

1. `npm install`
2. Tạo `.env.local` (xem [Biến môi trường](#biến-môi-trường))
3. `npm run dev` → mở http://localhost:3000
4. Đăng nhập bằng **tài khoản demo** (sẽ có sau khi auth hoàn tất)
5. Thử luồng: dán một tin nhắn/URL đáng ngờ → xem báo cáo rủi ro → thử màn hình MoMo mô phỏng (pre-transfer).

> Demo account: `TBD` (cập nhật khi auth xong).

## Stack

- Next.js 14.2 (App Router), React 18, TypeScript (strict), Tailwind 3.4, ESLint 8
- Dự kiến: shadcn/ui, Prisma + PostgreSQL (Supabase free), NextAuth (email/password)
- AI: AWS Bedrock — Claude 3.5 Haiku + tool calling; fallback heuristics local (không dùng OpenAI)
- Storage: S3 presigned URLs, lifecycle xoá sau 1 ngày
- Deploy: Vercel + Supabase

## Lệnh

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # typecheck
```

Lint và typecheck phải pass trước khi nộp.

## Biến môi trường

Khai báo trong `.env.local` (không commit `.env*`). Giá trị thật do lead backend quản lý.

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL (Supabase) |
| `NEXTAUTH_URL` | Base URL của app (vd `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret ký session NextAuth |
| `AWS_REGION` | Region Bedrock |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Credentials AWS (dùng cho Bedrock/S3) |
| `BEDROCK_MODEL_ID` | ID model Haiku trên Bedrock |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Key Google Safe Browsing |
| `S3_BUCKET` / `S3_REGION` | Bucket lưu nội dung tải lên (lifecycle 1 ngày) |

## Trust API contract

```
POST /api/analyze
req:  { type: "message"|"url"|"image_text", content: string, context?: "pre_transfer" }
res:  { score: 0-100, level: "safe"|"caution"|"high",
        signals: [{code, label, evidence}], recommendation: string,
        confidence: 0-1, model: "haiku"|"heuristic" }
```

- `image_text` = văn bản người dùng dán từ ảnh chụp màn hình; server **không** tự OCR (OCR là v2).
- Không đổi contract mà không thông báo frontend và cập nhật README này.

## Phạm vi MVP

- Auth + demo account
- Message Scanner, URL Scanner, Risk Engine, Explainable Report
- Trust Risk API + màn hình MoMo pre-transfer (mô phỏng)
- CSV import, transaction list, categorization, dashboard cơ bản
- Seed data, rate limit, `/api/health`, deploy
- Trang tĩnh: Landing, How to try in 60s, About, Privacy/Data Policy

**Hạn chế & Roadmap v2:** OCR/image scan, AI Financial Assistant đa mục đích, budget/spending alerts, anomaly detection, savings goals, recurring, Gmail monitoring, SES alerts. Chat chỉ single-turn về kết quả scan.

## Nguyên tắc

- Human-in-the-loop: AI không bao giờ tự chuyển tiền; màn hình MoMo ghi rõ đây là mô phỏng.
- Mọi kết quả rủi ro phải giải thích được (trích tín hiệu/nguồn). Thiếu bằng chứng → confidence thấp.
- Dữ liệu tối thiểu, có sự đồng ý rõ ràng, có thể thu hồi/xoá. Tuân thủ Nghị định 13/2023/NĐ-CP.

## Tài liệu nội bộ

- `.kiro/steering/` — nguồn chính thức cho product, structure, tech.
- `plan&idea/` — kế hoạch vận hành (local, không commit).
- `docs/archive/` — tài liệu lịch sử/tầm nhìn, không phải phạm vi build.
