# Nhan: Checklist xin quyền, cấp quyền, API key và hạ tầng

Phần việc này làm trên console/web, không phải code. Đánh dấu `[x]` khi xong.
Thứ tự đã sắp theo mức chặn: làm từ trên xuống.

> Đã bỏ khỏi MVP theo `tech.md`: S3 bucket, CloudWatch, SES, OCR. Không cần tạo.

---

## 1. AWS Bedrock (chặn nặng nhất, làm đầu tiên)

- [ ] Đăng nhập AWS account (root chỉ dùng để thiết lập ban đầu, bật MFA cho root).
- [ ] Chọn **region** và ghi lại (ví dụ `us-east-1`). Region này phải trùng với region xin quyền model.
- [ ] Vào **Bedrock → Model access** (hoặc Model catalog) → xin quyền model **Anthropic Claude Haiku**.
  - [ ] Điền form use case của Anthropic nếu console yêu cầu.
  - [ ] Chờ trạng thái `Access granted` (có thể từ vài phút đến vài giờ).
- [ ] Xác nhận **model ID chính xác** dùng được ở region đó. Một số model Haiku mới chỉ gọi được qua **inference profile** (ID dạng `us.anthropic...`), không gọi trực tiếp bằng model ID gốc.
  - [ ] Ghi `BEDROCK_MODEL_ID` đúng như console hiển thị.
  - [ ] Checklist cũ ghi "Claude 3.5 Haiku" nhưng `tech.md` chỉ yêu cầu "Haiku". Dùng bản Haiku nào đang có quyền và rẻ nhất.
- [ ] Kiểm tra giá token của model đã chọn để ước tính chi phí trong ngân sách $20.

## 2. AWS IAM (cấp quyền tối thiểu)

- [ ] IAM → Users → tạo user riêng, ví dụ `trustpay-bedrock` (không có console access).
- [ ] Gắn inline policy chỉ cho phép invoke đúng model:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
        "Resource": [
          "arn:aws:bedrock:<region>::foundation-model/<model-id>",
          "arn:aws:bedrock:<region>:<account-id>:inference-profile/<profile-id>"
        ]
      }
    ]
  }
  ```
  - Nếu dùng inference profile, policy cần cả ARN của profile và ARN foundation model ở các region mà profile định tuyến tới. Nếu gặp `AccessDenied`, đọc lỗi để biết ARN thiếu.
  - Gọi bằng Converse API vẫn cần `bedrock:InvokeModel`.
- [ ] Tạo **Access key** cho user này, lưu vào password manager. Không gửi qua chat, không commit.
- [ ] Điền `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BEDROCK_MODEL_ID` vào `.env.local`.
- [ ] **Smoke test:** `npm run smoke:bedrock`. Phải in `OK in ...ms` và reply.
  - Nếu `AccessDeniedException`: kiểm tra model access hoặc IAM policy.
  - Nếu `ValidationException` về model ID: đổi sang inference profile ID.

## 3. AWS Billing (bảo vệ ngân sách $20)

- [ ] Billing → **Budgets** → tạo budget hàng tháng, cảnh báo ở **$15** (80% của $20 cũng được), gửi email cho bạn.
- [ ] Bật **Billing alerts / Cost Anomaly Detection** nếu có.
- [ ] Ghi chú: Haiku only, không dùng model khác cho request thường.
- [ ] D7: kiểm tra spend còn dư địa trước khi demo.

## 4. Supabase (Postgres)

- [ ] Tạo project Supabase (free). Chọn region gần Vercel/AWS, ví dụ Singapore.
- [ ] Lưu database password. Nếu có ký tự đặc biệt, **URL-encode** khi đưa vào connection string.
- [ ] Project Settings → Database → Connection string:
  - [ ] **Pooled** (Transaction pooler, port `6543`) → `DATABASE_URL`, thêm `?pgbouncer=true`.
  - [ ] **Direct** (port `5432`) → `DIRECT_URL`.
- [ ] Chạy migration đầu: `npx prisma migrate dev --name init`
- [ ] Chạy seed: `npm run db:seed` (tạo 10 danh mục, tài khoản `demo@trustpay.ai`, 50 giao dịch).
- [ ] Kiểm tra `GET http://localhost:3000/api/health` trả `{"status":"ok"}`.
- [ ] Quyết định tạo **project Supabase riêng cho prod** hay dùng chung (nên tách để không làm hỏng dữ liệu demo).

## 5. Biến môi trường local

- [ ] Copy `.env.example` thành `.env.local`.
- [ ] `NEXTAUTH_SECRET`: tạo bằng `openssl rand -base64 32` (hoặc PowerShell: `[Convert]::ToBase64String((1..32 | % {Get-Random -Max 256}))`).
- [ ] `NEXTAUTH_URL=http://localhost:3000`.
- [ ] (Tùy chọn) `DEMO_PASSWORD` nếu muốn đổi mật khẩu demo mặc định `Demo@12345`.
- [ ] Xác nhận `.env.local` **không** nằm trong git (`git status`).

## 6. Google Safe Browsing API (lớp tất định cho URL)

- [ ] Vào Google Cloud Console → tạo project.
- [ ] APIs & Services → bật **Safe Browsing API**.
- [ ] Credentials → tạo **API key**.
  - [ ] Giới hạn key chỉ cho Safe Browsing API.
  - [ ] Nếu có thể, giới hạn theo IP hoặc referrer (Vercel IP thay đổi, nên ít nhất giới hạn theo API).
- [ ] Điền `SAFE_BROWSING_API_KEY`.
- [ ] Đọc điều khoản: bản miễn phí dành cho mục đích phi thương mại. Ghi chú trong README/Privacy.
- [ ] Nếu key chưa kịp có: engine coi Safe Browsing là `unknown`, không phải signal. Không chặn tiến độ.

## 7. RDAP (tuổi domain)

- [ ] Không cần API key. Dùng RDAP bootstrap (`https://rdap.org/domain/<domain>`) hoặc RDAP server của registry.
- [ ] Kiểm tra thủ công vài domain `.com`, `.vn`, `.xyz`. Nhiều TLD (đặc biệt `.vn`) có thể không trả ngày tạo: khi đó coi là `unknown`.
- [ ] Đặt timeout ngắn (khoảng 3 giây).

## 8. GitHub và phối hợp nhóm

- [ ] Tạo repo (hoặc xác nhận repo chung) và mời Quyen, Quynh.
- [ ] Làm trên nhánh `feature/...`, tạo PR. Commit nhỏ, không commit `.env*`.
- [ ] **Báo Quyen contract `POST /api/analyze`** và xin xác nhận (schema nằm ở `src/lib/risk/schema.ts`, mô tả ở `tech.md`).
- [ ] Báo Quyen các endpoint đã có: `/api/auth/*`, `/api/transactions`, `/api/transactions/[id]`, `/api/import`, `/api/health`.
- [ ] Xin **Quynh**:
  - [ ] File CSV sao kê mẫu (ít nhất 2 định dạng ngân hàng) để test import.
  - [ ] Bộ mẫu `eval/`: tin nhắn/URL lừa đảo **và mẫu an toàn**, kèm một mẫu prompt injection.
  - [ ] Nội dung Privacy/Data Policy (tham chiếu Nghị định 13/2023) để khớp với cách bạn lưu dữ liệu.

## 9. Vercel (deploy, phối hợp Quyen)

- [ ] Tạo/đăng nhập Vercel, import repo GitHub. Xác nhận ai sở hữu project (Quyen deploy frontend, bạn cần quyền vào env vars).
- [ ] Thêm member vào team hoặc đưa bạn quyền chỉnh Environment Variables.
- [ ] Thêm env vars (Production và Preview): `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (URL production), `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BEDROCK_MODEL_ID`, `SAFE_BROWSING_API_KEY`.
- [ ] Chạy migration lên DB prod: `npx prisma migrate deploy` (dùng `DIRECT_URL` prod).
- [ ] Chạy seed trên DB prod một lần.
- [ ] Ghi nhớ giới hạn Hobby: function timeout khoảng 10 giây.
- [ ] Smoke test live: đăng nhập, import CSV, `/api/health`, scan, mock MoMo.

## 10. Chống Supabase free-tier bị pause

- [ ] Chọn một cách gọi `/api/health` định kỳ:
  - [ ] Vercel Cron (`vercel.json`). Gói Hobby chỉ cho cron chạy tối đa mỗi ngày một lần, đủ để tránh pause.
  - [ ] Hoặc GitHub Actions schedule / cron-job.org / UptimeRobot (miễn phí, 5 phút/lần).
- [ ] Kiểm tra sau 1 ngày rằng ping vẫn chạy.
- [ ] Sau 03/12 đến 11/12: theo dõi uptime hằng ngày. URL phải sống khoảng 16 ngày sau khi nộp.

## 11. Bảo mật và dọn dẹp trước khi nộp

- [ ] `npm audit`: hiện có vài lỗ hổng mức high/critical trong dependency. Xem `npm audit` và chỉ nâng cấp nếu không phá bản Next 14.2.
- [ ] Xác nhận không có secret trong git history (`git log -p -S "AKIA"`).
- [ ] Rotate access key AWS nếu từng dán ở nơi không an toàn.
- [ ] Đổi/ẩn mật khẩu demo nếu không muốn công khai (README đang ghi tài khoản demo).
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm test` đều pass.

---

## Giá trị cần ghi lại (điền sau khi có)

| Mục | Giá trị |
| --- | --- |
| AWS region | |
| Bedrock model ID | |
| Supabase project (dev / prod) | |
| Vercel project URL | |
| Tài khoản demo | `demo@trustpay.ai` / (xem seed) |

---

## 12. Việc còn thiếu để chốt D1 và D0

Phần code D0 và D1 đã xong (`tsc`, lint và 6 unit test pass). Các việc sau cần bạn làm hoặc kiểm tra.

### Bắt buộc (chặn việc tiếp theo)
- [ ] Có `DATABASE_URL` và `DIRECT_URL` (mục 4), điền vào `.env.local`.
- [ ] `npx prisma migrate dev --name init`, rồi **commit thư mục `prisma/migrations/`**. Hiện chưa có thư mục này.
- [ ] `npm run db:seed` chạy không lỗi.
- [ ] Bedrock: có access, IAM và `npm run smoke:bedrock` in `OK` (mục 1 và 2). Chặn việc gắn LLM vào Risk Engine.
- [ ] Báo Quyen contract `/api/analyze` và danh sách endpoint (mục 8). Chặn frontend.

### Kiểm thử tay với DB thật (chưa chạy lần nào)
- [ ] `GET /api/health` trả `200 {"status":"ok","db":"up"}`. Thử ngắt DB để thấy `503`.
- [ ] Đăng ký: `POST /api/auth/register` với `consent: true` trả `201`. Thiếu `consent` hoặc email trùng phải trả `400` và `409`.
- [ ] Đăng nhập bằng `demo@trustpay.ai` / `Demo@12345`. Sai mật khẩu phải bị từ chối.
- [ ] `GET /api/transactions` chưa đăng nhập trả `401`. Sau đăng nhập trả 50 giao dịch cho demo, `limit` và `page` chạy đúng.
- [ ] Người dùng A không xem và không xóa được giao dịch của người dùng B (`DELETE` trả `404`).
- [ ] `POST /api/transactions` tạo mới được. Tạo lần hai cùng nội dung trả `409`.
- [ ] `POST /api/import` với CSV hợp lệ: `imported` đúng. **Import lần hai cùng file: `imported: 0`**, `duplicates` bằng số dòng hợp lệ.
- [ ] Import file có dòng lỗi: `errors` chỉ rõ số dòng và lý do. File sai cột trả `422`. File lớn hơn 1 MB trả `413`.
- [ ] Số tiền lớn gần 2 tỷ VND lưu được, không lỗi tràn số.

### Cần từ Quynh
- [ ] Ít nhất 2 file CSV sao kê thật (đã ẩn thông tin cá nhân) từ các ngân hàng khác nhau, để chỉnh bí danh cột và định dạng ngày/số.
- [ ] Mẫu `eval/`: scam, an toàn, và một mẫu prompt injection (cần trước D4).
- [ ] Nội dung Privacy/Data Policy khớp với việc hệ thống chỉ lưu hash và đoạn trích ngắn của nội dung đã scan.

### Cần từ Quyen
- [ ] Trang `/login` và form đăng ký (`authOptions.pages.signIn` đang trỏ `/login`).
- [ ] Xác nhận contract `/api/analyze`, ngưỡng `level` (70 và 35) và cách hiển thị `confidence` thấp.

### Quyết định cần chốt
- [ ] Model Bedrock cuối cùng (checklist cũ ghi "Claude 3.5 Haiku", steering ghi "Haiku").
- [ ] Ngưỡng `levelFromScore`: hiện tạm 70 là `high`, 35 là `caution`.
- [ ] Mật khẩu demo có công khai trong README hay không (hiện đang công khai).
- [ ] Prod dùng Supabase riêng hay dùng chung (mục 4).

### Git
- [ ] Tạo nhánh `feature/...`, commit D0 và D1, mở PR. Các file `.env*` không được commit.
- [ ] `plan&idea/` đang bị `.gitignore`. Xác nhận cả nhóm có bản riêng, hoặc quyết định đưa vào repo.

### Dọn dẹp nhỏ
- [x] Bỏ mục S3 và CloudWatch khỏi `docs/NHAN_TASKS.md` và `plan&idea/CHECKLIST_DEV_A.md` (steering đã loại khỏi MVP).
- [x] Đổi "WHOIS" thành "RDAP" trong hai checklist trên.
- [ ] `npm audit`: 10 lỗ hổng (có high và critical). Xem chi tiết trước khi nộp (mục 11).

### Việc code tiếp theo (chưa làm)
- [ ] D2: phân loại giao dịch bằng Haiku theo batch, fallback keyword. Hiện giao dịch import có `categoryId = null`.
- [ ] D3 và D4: khung Risk Engine, detector tất định, guardrail, circuit breaker.
- [ ] D5: `POST /api/analyze`, rate limit trong Postgres, ghi `ScanHistory`.
- [ ] D6: dashboard tổng thu/chi theo danh mục, seed thêm 6 đến 8 mẫu lừa đảo.
- [ ] Xóa dữ liệu theo yêu cầu người dùng (thu hồi đồng ý): xóa `ScanHistory` và giao dịch. Cần quyết định có làm trong MVP hay không.