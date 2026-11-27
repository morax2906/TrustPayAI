# TrustPay AI: Backend Status and Patterns (Nhan)

Cập nhật file này khi hoàn thành một mốc D*. Lịch chi tiết: `docs/NHAN_TASKS.md`. Các việc thủ công: `docs/NHAN_SETUP_CHECKLIST.md`.

## Đã có (D0, D1)
- Prisma schema: `User`, `Category`, `Transaction`, `ScanHistory`, `ApiUsage`, enum `TxType`, `UsageKind`. Chưa có `prisma/migrations/`.
- Auth: NextAuth Credentials + JWT (`src/lib/auth.ts`, `session.ts`), đăng ký ở `/api/auth/register` (bắt buộc `consent: true`).
- `/api/health`, `/api/transactions`, `/api/transactions/[id]`, `/api/import`.
- `src/lib/transactions/`: CSV parser, normalize, dedup, service, unit test (`npm test`).
- Seed: 10 danh mục, `demo@trustpay.ai`, 50 giao dịch. `scripts/bedrock-smoke.ts`.

## Đã có (D3, D5 phần lớn)
- `POST /api/analyze` (contract trong README, đã báo Quyen qua README). Luồng: session, validate, `consumeScan` (30/ngày/người), `haikuAllowed` (trần Haiku toàn hệ thống), `analyze`, `saveScan` (best effort).
- `src/lib/risk/`: `schema.ts` (zod; ngưỡng 70 = high, 35 = caution, tạm thời), `heuristic.ts` (lớp tất định, offline), `llm.ts` (Haiku qua Bedrock Converse + tool calling), `analyze.ts` (điều phối + fallback), `usage.ts` (giới hạn ngày, trần Haiku), `history.ts` (lưu hash + excerpt đã che số + `result` chỉ gồm code/label, không lưu evidence).
- Guardrail LLM: nội dung người dùng bọc trong `<content>`; khối "findings" chỉ chứa signal code; signal của model phải có evidence nằm trong nội dung gốc (tối thiểu 4 ký tự), nếu không thì bị loại; điểm tất định là mức sàn; không có signal nào của model được xác minh thì giữ nguyên điểm và recommendation tất định; recommendation của model chỉ dùng khi cùng level; circuit breaker 3 lần lỗi thì nghỉ 60 giây; timeout 5 giây.
- Heuristic: OTP chỉ tính khi là yêu cầu (động từ gửi/cung cấp/đọc... gần "OTP"), không tính tin nhắn thông báo OTP hay lời cảnh báo "không chia sẻ". Prompt injection tự nó đủ lên `caution` (40). Bỏ ký tự zero-width trước khi so khớp. Quét tối đa 20 URL.
- `eval/samples.json` (43 mẫu) + `npm run eval` + `src/lib/risk/eval.test.ts` (chạy trong `npm test`, làm cổng hồi quy). Mẫu do mình viết cùng lúc với rule nên số precision/recall chỉ là kiểm tra hồi quy, không phải độ chính xác thật.

## Chưa có
Phân loại giao dịch (D2), detector bổ sung: RDAP, Google Safe Browsing, sender mismatch (D4), dashboard API (D6), deploy và cron (D7), `POST /api/chat`.
Chưa kiểm thử với DB thật. Smoke test Bedrock chưa chạy (cần `.env.local`, đang chờ AWS xác minh tài khoản). Lớp Haiku mới được thử bằng client giả.

## Quyết định đã chốt
- Model: Haiku `anthropic.claude-haiku-5-5` (Bedrock, cross-region inference). Nếu ID trần bị `ValidationException`, dùng inference profile ID có tiền tố vùng. Chưa biết giá, chưa biết model có nhận `temperature` hay không (code hiện không gửi `temperature`).
- Trang Model access của Bedrock đã bị gỡ. Lần gọi Anthropic đầu tiên có thể cần form use case.
- Chi phí: đăng ký đang mở nên giới hạn theo người dùng không đủ chặn chi phí. `HAIKU_DAILY_CAP` (mặc định 300 lượt Haiku/ngày, đếm trong `ScanHistory`) là trần toàn hệ thống; vượt trần hoặc lỗi khi đếm thì dùng heuristic. Chưa biết giá Haiku nên con số 300 cần chỉnh sau khi có giá thật.
- D2: luật theo từ khóa chạy trước, Haiku chỉ xử lý các dòng chưa khớp, theo batch có giới hạn số batch mỗi request (Vercel Hobby timeout khoảng 10 giây). Dòng còn lại để `categoryId = null`, có endpoint phân loại lại.
- Chưa làm `POST /api/chat`. D5 chỉ cần bộ đếm chat trong rate limit.
- Đã bỏ S3, CloudWatch khỏi checklist. WHOIS đổi thành RDAP (không có dữ liệu thì `unknown`).

## Việc còn mở
- `npm audit`: `next@14.2.35` có advisory critical, sửa cần Next 16. Chưa quyết định nâng cấp. `plan&idea/DEVELOPMENT_PLAN.md` vẫn nhắc S3, CloudWatch, WHOIS.
- Chưa chọn: có endpoint xóa dữ liệu người dùng không (cần cho Nghị định 13/2023; `ScanHistory` đã có cascade khi xóa user).
- `/api/auth/register` chưa có giới hạn tốc độ theo IP, nên ai cũng tạo được nhiều tài khoản. Đã chặn phần chi phí Haiku bằng trần toàn hệ thống, nhưng chưa chặn spam đăng ký.
- `contentHash` trong `ScanHistory` là sha256 không salt, có thể đối chiếu ngược với nội dung đoán được. Chấp nhận được cho MVP, ghi lại để biết.
- Route `/api/analyze` chưa export `maxDuration`. Haiku timeout 5 giây cộng 3 lần gọi DB sát giới hạn 10 giây của Vercel Hobby, cần đo sau khi deploy.
- Heuristic chưa có: RDAP, Google Safe Browsing, sender mismatch. Từ khóa tiếng Việt viết lách tắt hoặc teencode sẽ bị bỏ sót.
- Việc thủ công còn lại: Supabase, migration, seed, Budget Alarm, IAM, smoke test (xem `docs/NHAN_SETUP_CHECKLIST.md`).

## Mẫu code cần giữ
- Route handler: kiểm tra session bằng `getUserId()`, validate input, gọi hàm trong `src/lib`, trả JSON. Lỗi trả mã ngắn như `{ error: "unauthorized" }`, `invalid_input`, `rate_limited`, `server_error`. Không trả stack trace, message của DB hay nội dung người dùng.
- Mọi query lọc theo `userId`. Người dùng A không đọc hay xóa được dữ liệu của B (trả 404).
- Env đọc qua `getEnv()` (`src/lib/env.ts`). `isBedrockConfigured()` quyết định dùng Haiku hay heuristic.
- Dedup: hash sha256 của ngày, loại, số tiền, mô tả đã chuẩn hóa, cộng chỉ số lần xuất hiện trong cùng file.
- Tiền lưu dạng số nguyên VND (đủ chứa số gần 2 tỷ).
- Không log nội dung người dùng hay secret. Lưu hash và đoạn trích ngắn (đã che số) của nội dung đã scan. Không lưu evidence trích dẫn.
- Rule heuristic chạy trên văn bản đã bỏ dấu: luôn bọc bằng `\b...\b` (nếu không "khoản tiền" khớp "hoan tien"), và kiểm tra mẫu an toàn tương ứng trong `eval/`.
- Gọi LLM: không đưa dữ liệu người dùng ra ngoài khối `<content>`; không tin đầu ra của model, luôn validate bằng zod và đối chiếu evidence với nội dung gốc.
- PowerShell: `R` là alias của `Invoke-History`, không đặt tên hàm là `R`. Ghi file có tiếng Việt bằng công cụ ghi file hoặc script Node, không dùng `Set-Content -Encoding UTF8` (thêm BOM làm hỏng JSON).

## Quy tắc khi làm tiếp
- Mọi tính năng LLM phải có fallback chạy được khi thiếu Bedrock. Việc kiểm tra không được phụ thuộc vào AWS.
- Đổi logic risk thì thêm mẫu scam, mẫu an toàn và mẫu prompt injection vào `eval/` và báo precision/recall.
- Đổi contract `/api/analyze` thì báo Quyen và cập nhật README.
- Trước khi báo xong: `npm run typecheck`, `npm run lint`, `npm test`.
- Không thêm S3, CloudWatch, SES, OCR, Gmail (v2).
- `plan&idea/` nằm trong `.gitignore`, chỉ `CHECKLIST_DEV_A.md` đã được commit từ trước. `DEVELOPMENT_PLAN.md` không có trong repo, nên đừng giả định các bạn khác có file đó.
