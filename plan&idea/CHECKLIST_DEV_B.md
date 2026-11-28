# Checklist — Dev B (Frontend/Fullstack Lead)

> Bối cảnh: 25/11 → nộp 03/12/2026 (8 ngày). Huấn luyện theo `DEVELOPMENT_PLAN.md`.

## Phase 0 — Hôm nay (25/11)
- [ ] Nhận **API contract** `POST /api/analyze` từ Dev A; chốt với Dev C click-path demo
- [ ] Khởi tạo UI shell: Tailwind config, shadcn/ui init, layout, theme, fonts
- [ ] Auth pages (login/register) nối NextAuth
- [ ] Nhận env `NEXT_PUBLIC_*`; dựng **staging deploy Vercel** sớm
- **DoD:** staging có trang login chạy được

## Phase 1 — D1 (26/11): Design System + Transactions
- [ ] **Chốt design tokens + layout mẫu** (unblock Dev C trang tĩnh)
- [ ] Transaction list + filter
- [ ] Import CSV UI (upload + preview + kết quả)
- **DoD:** danh sách giao dịch hiển thị từ API

## Phase 2 — D2 (27/11): Dashboard
- [ ] Dashboard: tổng thu/chi/ròng + chi theo danh mục (chart)
- [ ] Trang giả để Dev C tập click trên staging (có auth)
- **DoD:** Aha #1 — import → dashboard

## Phase 3 — D3 (28/11): Scanner + Report UI
- [ ] Scanner UI: message, URL
- [ ] Report UI: score, level, signals + evidence, recommendation, confidence
- [ ] Loading/skeleton states
- **DoD:** paste SMS/URL → report đẹp, rõ ràng (Aha #2)

## Phase 4 — D4 (29/11): Mock MoMo UI
- [ ] Mock màn hình "Chuyển tiền MoMo" (người nhận, số tiền, nút *Kiểm tra an toàn*)
- [ ] Nối nút → hiển thị cảnh báo/lý do + "Vẫn tiếp tục / Hủy"
- [ ] Banner "Bản mô phỏng tích hợp; không giữ tiền, không tự chuyển khoản"
- **DoD:** flow pre-transfer chạy được với API

## Phase 5 — D5 (30/11): Nối Trust API + Polish
- [ ] Nối mock MoMo → `POST /api/analyze` (`context:"pre_transfer"`)
- [ ] Hiển thị lỗi rate-limit thân thiện
- [ ] Polish UI toàn app
- **DoD:** end-to-end trust flow ổn định

## Phase 6 — D6 (1/12): Polish & QA
- [ ] Empty states, error states, responsive mobile
- [ ] Fix bug từ QA Dev C
- [ ] Đảm bảo demo path mượt (không dead-click)

## Phase 7 — D7 (2/12): Deploy & Smoke
- [ ] Fix bug cuối, responsive
- [ ] Smoke test live URL: auth, scan, import, dashboard, mock MoMo
- [ ] Kiểm tra staging/prod env
- [ ] Hỗ trợ Dev C quay video backup (UI sạch)

## Phase 8 — D8 (3/12): Buffer
- [ ] Fix cuối, lint/typecheck pass
- [ ] Có mặt backup Q&A (câu về implementation/deploy)

## Cross-cutting (làm suốt)
- [ ] Chỉ dùng shadcn/ui + design tokens thống nhất; trang tĩnh của Dev C phải khớp style
- [ ] Không hard-code secret; dùng env
- [ ] Không sửa file backend của Dev A (dùng API contract)
- [ ] Responsive + accessibility cơ bản (label, contrast)
- [ ] Chỉ commit khi được yêu cầu; giữ nhánh feature + PR

**Chặn ngay:** API contract từ Dev A + design tokens D1.
