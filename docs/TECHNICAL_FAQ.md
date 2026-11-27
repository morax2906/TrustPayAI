# TrustPay AI: Technical FAQ

Dành cho phần hỏi đáp kỹ thuật khi pitch. Mỗi câu trả lời bám theo code hiện tại. Chỗ nào chưa kiểm chứng thì ghi rõ, đừng nói quá lúc trả lời.

## 1. Hệ thống phát hiện lừa đảo hoạt động thế nào?
Hai lớp. Lớp tất định (`src/lib/risk/heuristic.ts`) chạy trước, offline: tìm từ khóa lừa đảo tiếng Việt (đòi OTP, giục gấp, mạo danh công an, dụ trúng thưởng, yêu cầu đặt cọc), và kiểm tra URL (punycode, địa chỉ IP, link rút gọn, đuôi tên miền hay bị lạm dụng, tên miền giả thương hiệu như `m0m0.vn.xyz`). Lớp thứ hai là Claude Haiku trên AWS Bedrock, chỉ tổng hợp và giải thích. Kết quả luôn có `score`, `level`, `signals`, `recommendation`, `confidence`.

## 2. Vì sao không để LLM tự chấm điểm?
LLM có thể bịa lý do và bị lừa bằng nội dung độc hại. Vì vậy điểm của lớp tất định là mức sàn: LLM chỉ được nâng điểm, không hạ được. Signal do LLM thêm vào phải có evidence là đoạn trích có thật trong nội dung gốc (từ 4 ký tự trở lên), nếu không sẽ bị loại. Nếu không signal nào của LLM được xác minh thì giữ nguyên điểm tất định.

## 3. Chống prompt injection thế nào?
- System prompt tách riêng, nội dung người dùng đặt trong khối `<content>` và được dặn là dữ liệu, không phải lệnh.
- Ký tự `</content>` trong nội dung bị loại bỏ để không đóng khối sớm.
- Khối "kết quả tất định" gửi cho model chỉ chứa mã signal, không chứa nội dung người dùng.
- Đầu ra bắt buộc qua tool calling với schema cố định, kiểm tra lại bằng zod, sai schema thì bỏ.
- Bản thân việc nội dung chứa lệnh kiểu "ignore previous instructions" là một signal (`prompt_injection`) và tự nó đủ nâng kết quả lên mức "caution".
- Có mẫu prompt injection trong `eval/samples.json` và test trong `src/lib/risk/llm.test.ts`.

## 4. Nếu AWS hoặc Bedrock bị lỗi thì sao?
Demo không chết. Thiếu cấu hình AWS, Bedrock lỗi, hết thời gian chờ (5 giây) hoặc trả sai schema thì hệ thống trả kết quả của lớp tất định với `model: "heuristic"`. Sau 3 lần lỗi liên tiếp, circuit breaker bỏ qua Bedrock trong 60 giây để request không bị chậm.

## 5. Độ chính xác bao nhiêu?
Hiện có 43 mẫu trong `eval/samples.json` (scam, tin an toàn, URL, prompt injection), chạy bằng `npm run eval`, đạt precision 1.00 và recall 1.00 cho lớp tất định. **Không nên trình bày đây là độ chính xác ngoài thực tế**: mẫu do nhóm tự viết cùng lúc với luật, nên chỉ chứng minh luật không bị hỏng khi sửa code. Chưa có bộ mẫu thật từ bên ngoài, và lớp Haiku chưa được đo.

## 6. Khi không có bằng chứng thì sao?
Nếu không thấy signal nào, kết quả là `safe` với `confidence` khoảng 0.4 và lời khuyên vẫn nhắc nên xác minh người nhận. Công cụ không bao giờ khẳng định an toàn tuyệt đối. Confidence của lớp tất định tối đa 0.85.

## 7. Dữ liệu người dùng được bảo vệ ra sao?
- Người dùng phải đồng ý rõ ràng khi đăng ký (`consent: true`, lưu `consentAt`), theo hướng Nghị định 13/2023.
- Nội dung đã quét không được lưu nguyên văn. Chỉ lưu hash SHA-256, một đoạn trích tối đa 80 ký tự (chuỗi từ 4 chữ số trở lên bị che) và kết quả không kèm đoạn trích evidence.
- Mọi truy vấn đều lọc theo `userId`, dữ liệu của người này không đọc được từ tài khoản khác.
- Bật Row Level Security trên mọi bảng để khóa truy cập qua REST API của Supabase. Ứng dụng kết nối bằng Prisma nên không bị ảnh hưởng.
- Chưa có endpoint xóa dữ liệu người dùng (còn nằm trong danh sách việc mở).
- Khi dùng Haiku, nội dung quét và mô tả giao dịch chưa phân loại được gửi tới AWS Bedrock. Trang Privacy nên ghi rõ điều này.

## 8. Chi phí và giới hạn lạm dụng?
Chỉ dùng Haiku. Mỗi người tối đa 30 lần quét mỗi ngày và 10 lượt phân loại bằng AI mỗi ngày. Có thêm trần toàn hệ thống (`HAIKU_DAILY_CAP`, mặc định 300 lượt Haiku mỗi ngày) vì đăng ký đang mở. Bộ đếm lưu trong Postgres, không dùng bộ nhớ tiến trình vì Vercel serverless không giữ trạng thái. Cần bật AWS Budget Alarm ở mức $15 (việc thủ công, chưa làm). Chưa biết đơn giá Haiku thật nên con số 300 cần chỉnh lại.

## 9. AI có tự chuyển tiền không?
Không. TrustPay không giữ tiền và không chuyển khoản. Màn hình "mock MoMo" chỉ mô phỏng bước trước khi chuyển tiền và hiển thị kết quả quét để người dùng tự quyết định. Đây là nguyên tắc human-in-the-loop của sản phẩm.

## 10. Quản lý tài chính cá nhân (nhập CSV, phân loại) có dùng AI không?
Có, nhưng chỉ ở mức minh họa. Luật từ khóa tiếng Việt chạy trước (miễn phí, offline). Các giao dịch chi tiêu còn lại được gửi cho Haiku theo lô (tối đa 40 dòng mỗi lô, 2 lô mỗi lần gọi để nằm trong giới hạn thời gian của Vercel). Haiku chỉ được chọn trong danh sách danh mục cố định, nên nội dung độc hại trong mô tả giao dịch cùng lắm chỉ làm sai một danh mục. Dòng nào chưa phân loại được giữ trống thay vì đoán, và có API để phân loại lại.

## Giới hạn đã biết (nên nói thật nếu được hỏi)
- Lớp Haiku mới được kiểm thử bằng client giả, chưa chạy với AWS thật.
- Chưa có kiểm tra tuổi tên miền (RDAP), Google Safe Browsing và so khớp người gửi.
- Luật từ khóa chưa xử lý tốt teencode hay viết tắt.
- Chưa quét ảnh. Người dùng tự dán chữ từ ảnh chụp màn hình (OCR nằm trong roadmap v2).
