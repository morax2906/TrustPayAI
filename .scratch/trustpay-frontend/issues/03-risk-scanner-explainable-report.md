# 03: Bộ quét rủi ro 3 chế độ & Báo cáo giải thích được (Scanner + Report)

**What to build:** Dựng trọn vẹn luồng quét lừa đảo tại khu vực Scanner: giao diện 3 tab tương ứng 3 loại đầu vào backend hỗ trợ (Tin nhắn SMS/Chat, Đường dẫn URL, Văn bản từ ảnh) kèm các nút điền mẫu thử nhanh, trạng thái loading skeleton khi đang phân tích, và bảng Báo cáo giải thích hiển thị trực tiếp ngay bên cạnh/bên dưới (điểm rủi ro 0–100, mức độ với câu chữ thận trọng "Chưa thấy dấu hiệu rủi ro rõ ràng" ở mức safe, danh sách signals kèm evidence trích dẫn, khuyến nghị hành động, % độ tin cậy kèm ghi chú khi ít dữ kiện, badge engine Haiku/Heuristic). Đồng thời lưu lịch sử các lần quét gần đây trong trình duyệt và hiển thị thông báo tiếng Việt thân thiện khi gặp lỗi giới hạn 30 lượt/ngày (HTTP 429).

**Blocked by:** 02: Xác thực người dùng (Login, Demo 1-Click, Register có Consent) & App Shell

**Status:** ready-for-agent

- [ ] Cả 3 tab (Tin nhắn, URL, Văn bản từ ảnh) đều gửi đúng payload tới API phân tích và hiển thị loading skeleton trong lúc chờ
- [ ] Các nút mẫu thử nhanh điền được nội dung mẫu lừa đảo và mẫu sạch để demo một chạm
- [ ] Báo cáo giải thích hiển thị đủ score, level badge, signals + evidence, recommendation, % confidence và engine badge; mức safe không khẳng định "an toàn tuyệt đối"
- [ ] Lịch sử quét gần đây trong phiên làm việc được lưu ở trình duyệt và bấm lại xem được kết quả cũ
- [ ] Lỗi vượt hạn mức 429 và lỗi validate/mạng hiển thị thông báo tiếng Việt rõ ràng
