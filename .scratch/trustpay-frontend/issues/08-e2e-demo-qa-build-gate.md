# 08: Rà soát End-to-End, Responsive Mobile & Cổng kiểm tra Build trước Deploy

**What to build:** Kiểm chứng toàn bộ click-path demo từ đầu đến cuối trên giao diện thật kết nối DB thật (Landing → Login Demo → Import CSV → Dashboard → Scanner 3 chế độ → Mock MoMo Pre-Transfer → Logout), rà soát toàn bộ empty/error states, độ tương phản và nhãn accessibility cơ bản, kiểm tra hiển thị responsive trên màn hình mobile và desktop không bị dead-click, và xác nhận toàn bộ các cổng chất lượng (`typecheck`, `lint`, `test` client logic, `next build`) đều pass sạch sẵn sàng deploy staging/production trên Vercel.

**Blocked by:** 04: Mô phỏng chuyển tiền MoMo có kiểm tra an toàn Pre-Transfer, 07: Dashboard tổng quan Thu/Chi/Ròng & Biểu đồ chi theo danh mục

**Status:** ready-for-agent

- [ ] Toàn bộ luồng demo chính chạy thông suốt trên DB thật, không còn link chết hay nút bấm không phản hồi
- [ ] Giao diện các màn hình chính hiển thị sạch trên cả mobile và desktop, không tràn ngang hay che khuất nút hành động
- [ ] Các biểu mẫu và điều khiển có nhãn rõ ràng và độ tương phản đạt chuẩn đọc được
- [ ] `npm run typecheck`, `npm run lint` và `npm run build` đều pass không lỗi
- [ ] Toàn bộ unit test phía client vừa bổ sung đều pass
