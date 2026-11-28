# 02: Xác thực người dùng (Login, Demo 1-Click, Register có Consent) & App Shell

**What to build:** Xây dựng hoàn chỉnh luồng đăng nhập, đăng ký và khung ứng dụng có bảo vệ phiên đăng nhập: trang Login nối NextAuth Credentials kèm nút "Đăng nhập nhanh tài khoản Demo", trang Register nối API đăng ký kèm checkbox bắt buộc đồng ý xử lý dữ liệu theo Nghị định 13/2023 liên kết tới trang Privacy, tự động chuyển hướng người dùng chưa đăng nhập về Login khi vào khu vực app, và App Shell responsive (Sidebar trên desktop, thanh điều hướng trên mobile) kết nối 4 khu vực chính (Dashboard, Quét lừa đảo, Mô phỏng MoMo, Giao dịch) cùng nút đăng xuất.

**Blocked by:** 01: Kiểm chứng môi trường DB, Design Tokens & Marketing Shell

**Status:** ready-for-agent

- [ ] Đăng nhập bằng email/mật khẩu hợp lệ và nút Đăng nhập nhanh tài khoản Demo đều tạo session thành công và điều hướng vào app
- [ ] Sai thông tin đăng nhập hiển thị thông báo lỗi tiếng Việt rõ ràng
- [ ] Trang đăng ký không cho submit nếu chưa tích đồng ý Nghị định 13/2023; đăng ký hợp lệ tạo tài khoản (xử lý lỗi email trùng 409) và đăng nhập được
- [ ] Truy cập các route trong khu vực app khi chưa đăng nhập tự động chuyển hướng về trang Login
- [ ] App Shell hiển thị điều hướng đầy đủ 4 mục trên cả desktop và mobile và hỗ trợ đăng xuất sạch session
