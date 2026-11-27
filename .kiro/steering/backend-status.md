# TrustPay AI: Backend Status and Patterns (Nhan)

Cập nhật file này khi hoàn thành một mốc D*. Lịch chi tiết: `docs/NHAN_TASKS.md`. Các việc thủ công: `docs/NHAN_SETUP_CHECKLIST.md`.

## Đã có (D0, D1)
- Prisma schema: `User`, `Category`, `Transaction`, `ScanHistory`, `ApiUsage`, enum `TxType`, `UsageKind`. Chưa có `prisma/migrations/`.
- Auth: NextAuth Credentials + JWT (`src/lib/auth.ts`, `session.ts`), đăng ký ở `/api/auth/register` (bắt buộc `consent: true`).
- `/api/health`, `/api/transactions`, `/api/transactions/[id]`, `/api/import`.
- `src/lib/transactions/`: CSV parser, normalize, dedup, service, unit test (`npm test`).
- `src/lib/risk/schema.ts`: zod cho request, response và đầu ra LLM; `levelFromScore` (70 = high, 35 = caution, tạm thời).
- Seed: 10 danh mục, `demo@trustpay.ai`, 50 giao dịch. `scripts/bedrock-smoke.ts`.

## Đã có (D3 một phần)
- `POST /api/analyze` chạy: heuristic (`src/lib/risk/heuristic.ts`), lớp Haiku (`llm.ts`, chỉ bật khi đủ env Bedrock, chưa thử với AWS thật), giới hạn 30 scan/ngày (`usage.ts`), lưu `ScanHistory` (`history.ts`, che chuỗi từ 4 số).
- `eval/` + 
pm run eval` (precision/recall của heuristic; mẫu do chính mình viết nên chỉ là kiểm tra hồi quy).

## Chưa có
Phân loại giao dịch (D2), Risk Engine và detector (D3, D4), `POST /api/analyze`, rate limit (D5), dashboard API (D6), deploy và cron (D7), `eval/`.
Chưa kiểm thử với DB thật. Smoke test Bedrock chưa chạy (cần `.env.local`).

## Quyết định đã chốt
- Model: Haiku `anthropic.claude-haiku-5-5` (Bedrock, cross-region inference). Nếu ID trần bị `ValidationException`, dùng inference profile ID có tiền tố vùng. Chưa biết giá, chưa biết model có nhận `temperature` hay không.
- Trang Model access của Bedrock đã bị gỡ. Lần gọi Anthropic đầu tiên có thể cần form use case.
- D2: luật theo từ khóa chạy trước, Haiku chỉ xử lý các dòng chưa khớp, theo batch có giới hạn số batch mỗi request (Vercel Hobby timeout khoảng 10 giây). Dòng còn lại để `categoryId = null`, có endpoint phân loại lại.
- Chưa làm `POST /api/chat`. D5 chỉ cần bộ đếm chat trong rate limit.
- Đã bỏ S3, CloudWatch khỏi checklist. WHOIS đổi thành RDAP (không có dữ liệu thì `unknown`).

## Việc còn mở
- `npm audit`: `next@14.2.35` có advisory critical, sửa cần Next 16. Chưa quyết định nâng cấp. `plan&idea/DEVELOPMENT_PLAN.md` vẫn nhắc S3, CloudWatch, WHOIS.
- Chưa chọn: có endpoint xóa dữ liệu người dùng không, có che số trong đoạn trích `ScanHistory` không.
- Việc thủ công còn lại: Supabase, migration, seed, Budget Alarm, IAM, smoke test, báo Quyen contract (xem `docs/NHAN_SETUP_CHECKLIST.md`).

## Mẫu code cần giữ
- Route handler: kiểm tra session bằng `getUserId()`, validate input, gọi hàm trong `src/lib`, trả JSON. Lỗi trả mã ngắn như `{ error: "unauthorized" }`, `invalid_input`, `server_error`. Không trả stack trace, message của DB hay nội dung người dùng.
- Mọi query lọc theo `userId`. Người dùng A không đọc hay xóa được dữ liệu của B (trả 404).
- Env đọc qua `getEnv()` (`src/lib/env.ts`). `isBedrockConfigured()` quyết định dùng Haiku hay heuristic.
- Dedup: hash sha256 của ngày, loại, số tiền, mô tả đã chuẩn hóa, cộng chỉ số lần xuất hiện trong cùng file.
- Tiền lưu dạng số nguyên VND (đủ chứa số gần 2 tỷ).
- Không log nội dung người dùng hay secret. Lưu hash và đoạn trích ngắn của nội dung đã scan.

## Quy tắc khi làm tiếp
- Mọi tính năng LLM phải có fallback chạy được khi thiếu Bedrock. Việc kiểm tra không được phụ thuộc vào AWS.
- Đổi logic risk thì thêm mẫu scam và mẫu prompt injection vào `eval/` và báo precision/recall.
- Đổi contract `/api/analyze` thì báo Quyen và cập nhật README.
- Trước khi báo xong: `npm run typecheck`, `npm run lint`, `npm test`.
- Không thêm S3, CloudWatch, SES, OCR, Gmail (v2).
- `plan&idea/` nằm trong `.gitignore`, chỉ `CHECKLIST_DEV_A.md` đã được commit từ trước. `DEVELOPMENT_PLAN.md` không có trong repo, nên đừng giả định các bạn khác có file đó.
