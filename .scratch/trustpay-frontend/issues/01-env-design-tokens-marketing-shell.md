# 01: Kiểm chứng môi trường DB, Design Tokens & Marketing Shell

**What to build:** Xác nhận cấu hình `.env` kết nối được tới PostgreSQL thật (qua health endpoint và kiểm tra tài khoản demo đã seed), thiết lập bộ Design Tokens light-first Fintech (Trust Navy/Teal, semantic Safe/Caution/High, font hỗ trợ tiếng Việt, shadcn/ui primitives), và dựng layout marketing dùng chung kèm 4 trang placeholder công khai (Landing ở route gốc, How to try in 60s, About, Privacy) để người dùng truy cập được ngay và unblock Dev C ghép nội dung tĩnh.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Health endpoint trả trạng thái DB up với cấu hình `.env` hiện tại (hoặc migration/seed hoàn tất nếu DB trống)
- [x] Design tokens, font tiếng Việt và các component UI nền tảng hoạt động nhất quán trên light theme
- [x] Route gốc hiển thị Landing placeholder có CTA rõ ràng dẫn tới trang đăng nhập/dùng thử
- [x] Các trang placeholder How to try, About và Privacy truy cập được qua điều hướng marketing không lỗi 404
- [x] `typecheck` và `lint` pass sạch

## Comments

- Đã thêm marketing route group với Landing, How to try, About và Privacy, cùng trang login placeholder để CTA không dẫn tới route 404; `GET /`, `/how-to-try`, `/about`, `/privacy` đều trả HTTP 200. `npm run typecheck` và `npm run lint` pass.
- `GET /api/health` trả HTTP 503 (`db: down`), nên chưa thể xác nhận tài khoản demo đã seed. Login callback cũng trả 401. Không chạy seed vì script xóa rồi tạo lại giao dịch tài khoản demo.
- `npm test` hiện có 2 lỗi ở test risk/eval chưa liên quan đến issue này; 22 test còn lại pass.
