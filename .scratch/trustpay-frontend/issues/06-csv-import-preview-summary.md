# 06: Import sao kê CSV có bảng xem trước (Preview) & Báo cáo kết quả

**What to build:** Bổ sung hoàn chỉnh luồng nhập sao kê CSV ngay trong khu vực Giao dịch: cho phép chọn hoặc kéo thả file CSV (hỗ trợ UTF-8 BOM và các dấu phân cách dấu phẩy, chấm phẩy, tab), hiển thị bảng xem trước 5–10 dòng đầu ở phía client trước khi xác nhận tải lên, gửi file lên API import để xử lý thật và chống trùng lặp, hiển thị thẻ tóm tắt kết quả chi tiết (tổng số dòng, số dòng đã nhập, số dòng trùng bị bỏ qua, danh sách lỗi theo số dòng nếu có), xử lý các lỗi quá dung lượng (413) hoặc sai định dạng cột (422), và tự động tải lại danh sách giao dịch.

**Blocked by:** 05: Sổ giao dịch — Danh sách phân trang, Lọc, Thêm/Xóa & Phân loại tự động

**Status:** ready-for-agent

- [ ] Chọn file CSV hiển thị bảng xem trước 5–10 dòng đầu chính xác với file dùng dấu phẩy, chấm phẩy, tab và có UTF-8 BOM
- [ ] Parser xem trước phía client có unit test kiểm tra các dấu phân cách và BOM
- [ ] Gửi file lên API import hiển thị đúng kết quả tổng dòng, số dòng nhập mới, số dòng trùng lặp và chi tiết lỗi theo dòng
- [ ] Upload lại cùng một file thể hiện số dòng nhập mới bằng 0 và báo đúng số dòng trùng
- [ ] Lỗi file quá lớn (413) và sai định dạng (422) hiển thị thông báo dễ hiểu bằng tiếng Việt; danh sách giao dịch tự động cập nhật sau khi import
