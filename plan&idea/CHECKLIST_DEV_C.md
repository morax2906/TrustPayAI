# Checklist — Dev C (Pitching Lead + Product/QA + Static UI)

> Bối cảnh: 25/11 → nộp 03/12/2026 (8 ngày). Huấn luyện theo `DEVELOPMENT_PLAN.md`.
> Nguyên tắc: **không nằm trên critical path của code**. Trang tĩnh dùng mẫu Dev B, hard deadline D4.

## Phase 0 — Hôm nay (25/11)
- [ ] **Chốt click-path demo** (từng bước bấm) → Dev A/B duyệt, khóa làm theo
- [ ] Tạo slide skeleton (5 phần: Hook → Demo → Làm chủ AI → Tích hợp/Tác động → Roadmap)
- [ ] Gom **6–8 mẫu lừa đảo thật** (anonymized) + **50 giao dịch seed**
- [ ] Viết onboarding copy (60s thấy giá trị)

## Phase 1 — D1 (26/11): Nội dung + Trang tĩnh
- [ ] Bắt đầu 4 trang tĩnh theo design tokens của Dev B
- [ ] **Ground-truth eval**: gán nhãn 40–60 mẫu (25 lừa đảo + 25 sạch) cho Dev A
- [ ] Hoàn thiện onboarding copy
- **DoD:** eval labels bàn giao Dev A; trang tĩnh khởi công

## Phase 2 — D2 (27/11): QA lần 1
- [ ] Test staging (auth) → báo bug cho Dev A/B
- [ ] Tiếp tục trang tĩnh
- **DoD:** danh sách bug đầu tiên

## Phase 3 — D3 (28/11): Kịch bản + Mock MoMo
- [ ] Thiết kế flow mock MoMo (Penpot/copy) bàn giao Dev B
- [ ] Viết **kịch bản 5 phút** (lời thoại)
- [ ] Tiếp tục trang tĩnh
- **DoD:** kịch bản v1 + flow mock MoMo

## Phase 4 — D4 (29/11): Deadline trang tĩnh + Tập pitch
- [ ] **Deadline 4 trang tĩnh merge** (không xong → Dev B placeholder)
- [ ] **Bắt đầu tập pitch trên staging** (scan/report đã có)
- **DoD:** trang tĩnh xong; pitch dry-run #1

## Phase 5 — D5 (30/11): Tài liệu
- [ ] **Technical FAQ** (nhận từ Dev A) → thuộc 5 câu cốt lõi
- [ ] **RUBRIC_MAPPING.md** map 4 tiêu chí → demo cụ thể
- [ ] **README** (live URL, demo account, test 60s, limitations, roadmap v2)
- **DoD:** bộ tài liệu nộp bài đầy đủ

## Phase 6 — D6 (1/12): Rehearsal
- [ ] **Tập full demo 5 lần**, bấm giờ
- [ ] **Mock Q&A** (câu hỏi giám khảo khó)
- [ ] Chấm thử theo rubric; báo bug
- **DoD:** demo < 5 phút, không dead-click

## Phase 7 — D7 (2/12): Chốt
- [ ] **Quay video backup** demo
- [ ] Chốt slide (bảng Precision/Recall, sơ đồ 2 lớp, Trust API, chỉ số tác động, NĐ13)
- [ ] Rehearsal cuối có **Q&A với Dev A**
- **DoD:** video + slide + kịch bản final

## Phase 8 — D8 (3/12): Nộp
- [ ] **Nộp bài**
- [ ] Diễn thử lần cuối
- [ ] Chuẩn bị trả lời giám khảo D8→11/12

## Definition of Done
- [ ] 4 trang tĩnh merge ≤ D4, không sửa file dev khác
- [ ] Click-path demo chốt D0 và bám đúng
- [ ] Seed data + ground-truth eval ≤ D1
- [ ] README + rubric mapping + Technical FAQ ≤ D5
- [ ] 5 dry-run + video backup ≤ D7
- [ ] Thuộc 5 câu FAQ cốt lõi + kịch bản 5 phút

## 5 câu FAQ cốt lõi phải thuộc
1. Kiến trúc 2 lớp (tất định + LLM) khác gì "LLM wrapper"?
2. Confidence/evidence xử lý hallucination thế nào?
3. Vì sao AI không tự chuyển tiền (human-in-the-loop)?
4. Chống prompt injection ra sao?
5. Bedrock lỗi thì hệ thống xử lý thế nào (fallback)?

## Protocol Q&A
- Dev C dẫn tất cả câu về sản phẩm/pain/tác động/roadmap.
- Dev A vào câu AI/kiến trúc; Dev B vào câu implementation/deploy.
- Chuyển giao: *"Phần kỹ thuật mời anh A làm rõ"* rồi im lặng.
