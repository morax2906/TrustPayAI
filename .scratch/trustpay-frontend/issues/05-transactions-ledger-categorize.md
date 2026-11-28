# 05: Sổ giao dịch — Danh sách phân trang, Lọc, Thêm/Xóa & Phân loại tự động

**What to build:** Xây dựng màn hình quản lý giao dịch kết nối các endpoint giao dịch hiện có: bảng danh sách có phân trang, bộ lọc Loại (Thu/Chi) và khoảng ngày (Từ ngày – Đến ngày) gọi qua API, bộ lọc nhanh theo Danh mục trên dữ liệu đang hiển thị, modal/form thêm mới giao dịch tay, thao tác xóa giao dịch có hộp thoại xác nhận, và nút "Phân loại tự động" gọi API phân loại hàng loạt theo luật từ khóa cho các dòng chưa có danh mục. Đảm bảo có đầy đủ loading, empty và error states cùng unit test cho các hàm hỗ trợ lọc/định dạng phía client.

**Blocked by:** 02: Xác thực người dùng (Login, Demo 1-Click, Register có Consent) & App Shell

**Status:** ready-for-agent

- [ ] Danh sách giao dịch tải từ API với phân trang hoạt động và hiển thị định dạng tiền VND, ngày, loại thu/chi, danh mục
- [ ] Bộ lọc loại thu/chi, khoảng ngày (qua API) và lọc danh mục (ở client) cập nhật danh sách chính xác
- [ ] Thêm giao dịch mới hợp lệ cập nhật được vào bảng (và xử lý lỗi trùng 409 / input không hợp lệ)
- [ ] Xóa giao dịch yêu cầu xác nhận trước khi gọi API xóa và làm mới danh sách
- [ ] Nút "Phân loại tự động" gọi API phân loại, thông báo số dòng đã phân loại/còn trống và cập nhật lại danh sách; có unit test cho helper phía client
