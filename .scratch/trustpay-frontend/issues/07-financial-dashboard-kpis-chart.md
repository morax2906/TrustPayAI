# 07: Dashboard tổng quan Thu/Chi/Ròng & Biểu đồ chi theo danh mục

**What to build:** Hoàn thiện trang Dashboard trung tâm cho luồng "Aha #1 (import → dashboard)": tải dữ liệu giao dịch qua API phân trang sẵn có để tổng hợp Tổng thu, Tổng chi, Số dư ròng và cơ cấu chi tiêu theo từng danh mục (bao gồm nhóm Chưa phân loại) phía frontend mà không sửa backend, trực quan hóa bằng biểu đồ Recharts, kèm liên kết nhanh sang các luồng Quét lừa đảo, Mô phỏng MoMo và Giao dịch/Import CSV, cùng loading, empty và error states và unit test cho logic tổng hợp số liệu.

**Blocked by:** 05: Sổ giao dịch — Danh sách phân trang, Lọc, Thêm/Xóa & Phân loại tự động, 06: Import sao kê CSV có bảng xem trước (Preview) & Báo cáo kết quả

**Status:** ready-for-agent

- [ ] Dashboard tổng hợp đúng Tổng thu, Tổng chi, Số dư ròng từ toàn bộ các trang giao dịch trả về bởi API
- [ ] Biểu đồ Recharts hiển thị trực quan tỷ trọng/giá trị chi theo từng danh mục (xử lý gọn cả nhóm chưa phân loại)
- [ ] Khi tài khoản chưa có giao dịch hiển thị empty state kèm nút dẫn nhanh tới Import CSV / Thêm giao dịch
- [ ] Có điều hướng nhanh từ Dashboard sang Scanner và Mock MoMo
- [ ] Logic tổng hợp KPI và nhóm danh mục có unit test chạy qua runner test của dự án
