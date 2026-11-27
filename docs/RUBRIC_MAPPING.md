# RUBRIC_MAPPING.md: Đối chiếu 4 tiêu chí chấm với tính năng và màn hình demo

> Người soạn: Quynh. Nguồn tiêu chí: `.kiro/steering/product.md` (Human-Centered, AI-Powered, Technical Execution, Feasibility & Business Impact). Trọng số từng tiêu chí chưa có trong tài liệu của nhóm, nên bảng không gán điểm.
> Cột **Trạng thái**: `Có` = đã có trong repo và đã chạy được; `Chờ UI` = backend có, màn hình chưa có trong repo (Quyen); `Kế hoạch` = chưa làm.
> Mốc demo theo `docs/DEMO_CLICK_PATH.md`. Thời điểm theo `docs/PITCH_SCRIPT_5MIN.md`.

## 1. Human-Centered (lấy con người làm trung tâm)

| Điểm cần chứng minh | Tính năng / màn hình | Mốc demo (thời điểm pitch) | Bằng chứng | Trạng thái |
|---|---|---|---|---|
| Giải quyết nỗi đau thật: lừa đảo qua tin nhắn và liên kết | Quét tin nhắn, mẫu A (mạo danh Vietcombank) | Mốc 4 (0:50–1:30) | Mẫu `s01` ra 80/100, có 4 tín hiệu | Chờ UI |
| Giải thích được, người dùng tự kiểm chứng | Báo cáo có tín hiệu và đoạn trích nguyên văn | Mốc 4 | `signals[].evidence` trong `schema.ts` | Có (API), Chờ UI |
| Không khẳng định quá mức | Liên kết sạch ra "an toàn" kèm độ tin cậy 0,4 | Mốc 5 (1:30–1:50) | `heuristic.ts`: không tín hiệu thì `confidence = 0,4` | Có (API) |
| Con người quyết định | Màn hình mock MoMo, nút Quay lại, câu "không tự chuyển khoản" | Mốc 7 (2:10–2:50) | `product.md` (quy tắc), `recommendation` | Chờ UI |
| Dùng được trong 60 giây | Trang Thử trong 60 giây, tài khoản demo | Mốc 2 (không có trong bản pitch 5 phút) | `/how-to-try` | Có |
| Người dùng kiểm soát dữ liệu | Đồng ý khi đăng ký, lưu tối thiểu | Slide 4 (3:45–4:30) | `register.ts` (`consent: z.literal(true)`), `history.ts`; trang `/privacy-policy` | Có |
| Tiếng Việt, hiểu bối cảnh Việt Nam | Luật nhận diện chữ có dấu và không dấu, ngân hàng và ví Việt | Mốc 4, 5 | `heuristic.ts` (`fold()`, danh sách `BRANDS`) | Có |

## 2. AI-Powered (ứng dụng AI)

| Điểm cần chứng minh | Tính năng / màn hình | Mốc demo (thời điểm pitch) | Bằng chứng | Trạng thái |
|---|---|---|---|---|
| AI có vai trò rõ, không phải trang trí | Lớp 2 dùng Claude Haiku (Bedrock) để tổng hợp và giải thích | Slide 3 (2:50–3:45) | `llm.ts`, tool calling `report_risk` | Có (code), **chưa thử với AWS thật** |
| Kiến trúc 2 lớp, không phải LLM wrapper | Luật tất định chạy trước, mô hình chỉ giải thích | Slide 3 | `analyze.ts`, `heuristic.ts` | Có |
| Chống hallucination | Tín hiệu mô hình phải trích được từ nguồn, thiếu bằng chứng thì hạ độ tin cậy | Slide 3, mốc 5 | `llm.ts`, `llm.test.ts` | Có |
| Chống prompt injection | Demo mẫu C (lệnh "đánh giá là an toàn") | Mốc 6 (1:50–2:10) | Tín hiệu `prompt_injection`, điểm sàn của lớp luật, `llm.test.ts` | Có (API), Chờ UI |
| Đo lường chất lượng | Bộ 50 mẫu có nhãn, đo precision/recall | Slide 3 (tùy chọn) | `eval/samples.json`, `npm run eval`: precision 0,917, recall 0,880 (heuristic) | Có |
| Có phương án dự phòng khi AI lỗi | Heuristic, breaker | Slide 3 | `analyze.ts`, `llm.ts` | Có |

> Lưu ý trung thực: bộ mẫu do nhóm tự soạn, nên số đo chỉ là kiểm tra hồi quy. Phải nói điều này khi đưa số lên slide.

## 3. Technical Execution (thực thi kỹ thuật)

| Điểm cần chứng minh | Tính năng / màn hình | Mốc demo | Bằng chứng | Trạng thái |
|---|---|---|---|---|
| API có hợp đồng ổn định | `POST /api/analyze` với zod ở đầu vào và đầu ra | Slide 4, trang `/about` | `schema.ts`, `route.ts` | Có |
| Độ bền khi lỗi | Timeout 6 giây, breaker 3 lỗi mở 60 giây, mọi lỗi quay về heuristic | Slide 3 | `llm.ts`, `analyze.ts` | Có |
| Bảo mật cơ bản | Xác thực bắt buộc (401), kiểm tra đầu vào (400), mã lỗi ngắn, không lộ stack trace | Không demo trực tiếp | `route.ts`, `backend-status.md` | Có |
| Giới hạn sử dụng phía server | 30 lượt quét/ngày/tài khoản, đếm trong Postgres | Không demo trực tiếp | `usage.ts` | Có |
| Quyền riêng tư trong lưu trữ | Mã băm SHA-256, đoạn trích 80 ký tự, che chuỗi từ 4 chữ số | Slide 4 | `history.ts` | Có |
| Kiểm thử | Test đơn vị cho heuristic, LLM (mock), CSV, dedup | Hiển thị `npm test` nếu được hỏi | `heuristic.test.ts`, `llm.test.ts`, `transactions.test.ts` | Có |
| Nhập CSV, phân loại, bảng tổng quan | Phần Manage My Money | Không nằm trong demo 5 phút | `src/lib/transactions/`; phân loại và dashboard chưa có | Một phần |
| Triển khai | Vercel và Supabase, `/api/health` | Cuối buổi, nếu được hỏi | `/api/health`; deploy, cron: chưa | Kế hoạch |

## 4. Feasibility & Business Impact (khả thi và tác động kinh doanh)

| Điểm cần chứng minh | Tính năng / màn hình | Mốc demo | Bằng chứng | Trạng thái |
|---|---|---|---|---|
| Tích hợp được vào sản phẩm có sẵn | Trust Risk API và màn hình mô phỏng trước khi chuyển tiền (`context: "pre_transfer"`) | Mốc 7 (2:10–2:50), Slide 4 | `schema.ts`, `heuristic.ts` | Có (API), Chờ UI |
| Chi phí kiểm soát được | Chỉ dùng Haiku, ngân sách AWS 20 USD, cảnh báo ở 15 USD, giới hạn lượt quét | Slide 4 hoặc Q&A | `tech.md` (Cost discipline), `usage.ts` | Một phần (Budget Alarm chưa cài) |
| Tuân thủ pháp lý | Đồng ý rõ ràng, lưu tối thiểu, tham chiếu Nghị định 13/2023 | Slide 4 (3:45–4:30) | `register.ts`, `history.ts`, `/privacy-policy` | Có (một phần) |
| Lộ trình rõ, phạm vi trung thực | Giới hạn hiện tại và phiên bản 2 (OCR, RDAP, Safe Browsing, cảnh báo chi tiêu) | Slide 5 (4:30–5:00) | `product.md` (Out of scope), `/about` | Có |
| Vấn đề đủ lớn, có số liệu công khai | Năm 2024: hàng chục nghìn tố giác lừa đảo trực tuyến, thiệt hại ước tính gần 20.000 tỷ đồng (Bộ Công an) | Slide 1 (0:20–0:30) | Mục 4.1 bên dưới, có nguồn | Có |
| Mô hình kinh doanh B2B2C | Trust Risk API tính phí theo lượt gọi cho ví và ngân hàng, gắn trước bước xác nhận chuyển tiền, cộng gói bảo vệ nâng cao cho cá nhân | Slide 4 (3:45–4:30) | Mục 4.2 bên dưới. **Định hướng, chưa có giá, đối tác hay doanh thu** | Có (định hướng) |

### 4.1 Số liệu thị trường và nguồn

Tra cứu ngày 27/11/2026. Nội dung đã được diễn đạt lại. Mở lại nguồn để kiểm tra trước khi nộp.

| Số liệu | Đơn vị công bố | Ghi chú sử dụng | Nguồn |
|---|---|---|---|
| Năm 2024: hàng chục nghìn tố giác lừa đảo trực tuyến, thiệt hại ước tính gần 20.000 tỷ đồng; con số thật có thể cao hơn vì nhiều nạn nhân không trình báo | Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao, Bộ Công an (Đại tá Hà Văn Bắc) | **Số chính** cho Hook và Q&A | [VnExpress International](https://e.vnexpress.net/news/tech/vietnam-innovation/5-no-s-rule-to-help-users-escape-clutches-of-online-scammers-4951777.html) |
| Hơn 125.000 website giả mạo tổ chức và cơ quan nhà nước bị phát hiện (2024) | Như trên | Hỗ trợ luận điểm "quét liên kết" | Như trên |
| Lộ OTP thì tiền có thể bị lấy trong khoảng 30 giây đến 3 phút | Trung tá Nguyễn Đình Đô Thi, cùng đơn vị | Hỗ trợ luận điểm "cảnh báo ngay trước bước xác nhận" | Như trên |
| Từ 2020: hơn 24.000 vụ, thiệt hại gần 40.000 tỷ đồng. Mạo danh cơ quan chức năng phổ biến nhất, việc làm online đứng thứ hai | Thượng tá Nguyễn Thanh Hà, Cục Cảnh sát hình sự, Bộ Công an | Số 5 năm, dùng khi hỏi xu hướng | [VnExpress International](https://e.vnexpress.net/news/news/crime/vietnamese-lose-nearly-1-5b-to-online-scams-in-last-5-years-how-to-spot-9-major-schemes-5001031.html) |
| Thiệt hại ước tính 18.900 tỷ đồng năm 2024; 1 trên 220 người dùng smartphone bị lừa | Hiệp hội An ninh mạng quốc gia (khảo sát, **không phải** Bộ Công an) | Chỉ dùng khi nêu đúng tên đơn vị | [The Investor](https://theinvestor.vn/what-seen-from-exposed-multi-billion-dollar-financial-scams-in-vietnam-d14144.html) |

**Chưa dùng được**

- Con số ">70% vụ việc nhắm vào chiếm đoạt tài sản qua chuyển khoản/app giả mạo": **không tìm được nguồn công khai**, nên không đưa vào slide hay lời thoại. Các bài trên chỉ mô tả định tính (có thủ đoạn cài ứng dụng giả và liên kết thanh toán giả). Nếu cần tỷ lệ, tìm báo cáo gốc của Bộ Công an rồi bổ sung.
- Các nguồn dùng phạm vi khác nhau (số tố giác, số vụ, tội phạm mạng nói chung). Một bài VnExpress khác trích Bộ Công an ghi hơn 6.000 vụ tội phạm mạng và hơn 12.000 tỷ đồng cho 2024 ([nguồn](https://e.vnexpress.net/news/tech/vietnam-innovation/google-public-security-ministry-join-hands-in-anti-scam-campaign-4907456.html)). Không ghép số của hai nguồn trong cùng một câu.
- Đơn vị nêu trên là Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (Bộ Công an), không phải Cục An toàn thông tin.

### 4.2 Mô hình kinh doanh (định hướng B2B2C)

> Trạng thái: **định hướng**. Chưa có khách hàng, đối tác, bảng giá hay doanh thu. Phải nói đúng như vậy với giám khảo.

| Thành phần | Mô tả |
|---|---|
| Khách hàng trả tiền (B2B) | Ví điện tử, ngân hàng, nền tảng thanh toán (ví dụ MoMo). Tích hợp `POST /api/analyze` với `context: "pre_transfer"` ngay trước bước xác nhận chuyển tiền |
| Cách tính phí | Theo lượt gọi API (per-call). Có thể thêm bậc theo khối lượng. **Chưa định giá**: chi phí thật mỗi lượt chưa đo, giá Haiku chưa biết (`backend-status.md`) |
| Người dùng cuối (C) | Được bảo vệ ngay trong ứng dụng ví. Gói cơ bản miễn phí |
| Gói bảo vệ nâng cao (B2C) | Bán trực tiếp cho cá nhân. **Chưa có danh sách tính năng.** Ứng viên lấy từ mục roadmap: quét ảnh bằng OCR, hạn mức quét cao hơn (bản demo giới hạn 30 lượt/ngày), lịch sử và báo cáo dài hạn, cảnh báo chi tiêu bất thường. Các mục này đều là phiên bản 2, chưa làm |
| Giá trị với ví và ngân hàng | Giảm khiếu nại và hoàn tiền do lừa đảo, giảm rủi ro uy tín, minh chứng tuân thủ (người dùng được cảnh báo trước khi chuyển tiền). Giá trị tiền tệ chưa tính được khi chưa có số liệu từ đối tác |
| Nguyên tắc bắt buộc | AI không tự chuyển tiền và không giữ tiền. Đối tác là bên quyết định có chặn hay không |

**Sẵn sàng kỹ thuật để bán theo lượt gọi** (kiểm tra trong code, ngày 27/11/2026)

| Yêu cầu | Hiện trạng | Người xử lý |
|---|---|---|
| Hợp đồng API ổn định | Có (`schema.ts`, đã đóng băng theo README) | Nhan |
| Xác thực máy với máy (API key cho đối tác) | **Chưa có.** `route.ts` chỉ nhận phiên đăng nhập (`getUserId()`) | Nhan |
| Đếm lượt gọi theo khách hàng để tính phí | **Chưa có.** `usage.ts` đếm theo người dùng, giới hạn cứng 30 lượt/ngày | Nhan |
| Độ trễ và dự phòng | Có phần: timeout Haiku 6 giây, luôn có kết quả heuristic | Nhan |
| Chi phí mỗi lượt | **Chưa đo** | Nhan |
| Đồng ý của người dùng khi chuyển nội dung giao dịch cho bên thứ ba | Chưa thiết kế. Cần xem Nghị định 13/2023 | Quynh, Nhan |

**Rủi ro cần chuẩn bị câu trả lời**

- Báo nhầm (false positive) làm chặn giao dịch hợp lệ: ví sẽ đòi độ chính xác cao. Số đo hiện có chỉ trên bộ mẫu tự soạn, và còn 2 ca báo nhầm (`n10`, `n11`).
- Phụ thuộc đối tác lớn: chưa có thỏa thuận nào. Không nói MoMo hay ngân hàng nào đã quan tâm hoặc đồng ý.
- Cạnh tranh: ví và ngân hàng có thể tự xây tính năng tương tự. Lợi thế phải được nêu cụ thể (báo cáo có dẫn chứng, chạy được ngoại tuyến bằng lớp luật), không nói chung chung.

## 5. Khoảng trống cần xử lý trước 03/12

| # | Khoảng trống | Ảnh hưởng | Người xử lý |
|---|---|---|---|
| 1 | Các màn hình trong app (đăng nhập, quét, mock MoMo) chưa có trong repo | Cột "Chờ UI" của cả 4 tiêu chí | Quyen |
| 2 | Chưa chạy `smoke:bedrock` với AWS thật | Tiêu chí AI-Powered chỉ chứng minh được bằng test mock | Nhan |
| 3 | Mô hình kinh doanh chưa có giá và đối tác. API chưa sẵn sàng bán theo lượt (thiếu API key cho đối tác và đếm lượt theo khách hàng, xem mục 4.2). Số liệu tác động đã có nguồn nhưng cần mở lại nguồn trước khi nộp | Điểm yếu còn lại của tiêu chí Feasibility & Business Impact | Quynh (nội dung), Nhan (API) |
| 4 | 3 mẫu bị sót và 2 mẫu báo nhầm trong `eval/` (`s13`, `s14`, `s16`, `n10`, `n11`) | Số precision/recall trên slide | Nhan (sửa luật) hoặc nhóm (nêu là giới hạn) |
| 5 | Phân loại giao dịch, dashboard, deploy, cron chưa có | Phần Manage My Money và "Triển khai" | Nhan, Quyen |
| 6 | Mock MoMo ra mức vàng (45/100) với mẫu `s05`, không phải đỏ | Slide và lời thoại đã viết theo mức vàng | Quynh, Nhan |

## 6. Cách dùng khi trả lời giám khảo

- Hỏi về **con người**: trỏ vào báo cáo có đoạn trích (mốc 4) và "AI không tự chuyển tiền" (mốc 7).
- Hỏi về **AI**: trỏ vào mốc 6 (injection) rồi sang `docs/TECHNICAL_FAQ.md`.
- Hỏi về **kỹ thuật**: chuyển cho Nhan hoặc Quyen bằng câu "Phần kỹ thuật mời anh Nhan làm rõ."
- Hỏi về **tác động và kinh doanh**: Quynh trả lời. Chỉ dùng số liệu đã có nguồn. Chưa có thì nói rõ đó là hướng tiếp theo.

