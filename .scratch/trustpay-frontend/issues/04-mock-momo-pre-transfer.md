# 04: Mô phỏng chuyển tiền MoMo có kiểm tra an toàn Pre-Transfer

**What to build:** Xây dựng màn hình mô phỏng chuyển tiền ví MoMo (dùng điểm nhấn hồng MoMo đặc trưng và hiển thị cố định banner cảnh báo: "Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản."). Người dùng có thể nhập Người nhận, Số tiền (VND), Lời nhắn/Link liên quan (hoặc chọn nhanh kịch bản mẫu lừa đảo / bình thường), bấm "Kiểm tra an toàn" để gọi API phân tích với ngữ cảnh pre-transfer và xem kết quả giải thích rủi ro tái sử dụng từ UI báo cáo, sau đó chọn "Hủy giao dịch" hoặc "Tôi hiểu rủi ro, vẫn tiếp tục" (chỉ hiện trạng thái xác nhận mô phỏng, tuyệt đối không ghi giao dịch vào DB hay trừ tiền thật).

**Blocked by:** 03: Bộ quét rủi ro 3 chế độ & Báo cáo giải thích được (Scanner + Report)

**Status:** ready-for-agent

- [ ] Banner tuyên bố mô phỏng (không giữ tiền, không tự chuyển khoản) luôn hiển thị rõ ràng trên màn hình Mock MoMo
- [ ] Form gồm Người nhận, Số tiền, Lời nhắn/Link liên quan và ít nhất 2 kịch bản mẫu điền nhanh (nghi lừa đảo và bình thường)
- [ ] Nút "Kiểm tra an toàn" gửi payload kèm ngữ cảnh pre-transfer lên API phân tích và render cảnh báo/lý do rõ ràng
- [ ] Hai lựa chọn "Hủy giao dịch" và "Tôi hiểu rủi ro, vẫn tiếp tục" dẫn tới trạng thái kết thúc mô phỏng rõ ràng, không tạo bản ghi thật trong sổ giao dịch
- [ ] Logic ghép payload mô phỏng có unit test kiểm tra trường hợp có và không có lời nhắn/link
