# PITCH_SCRIPT_5MIN.md: Kịch bản thuyết trình 5 phút (v1)

> Người soạn: Quynh (Pitching Lead). Tổng thời lượng: **5:00 chính xác**, chưa tính Q&A.
> Căn cứ: `docs/DEMO_CLICK_PATH.md`, `.kiro/steering/*`, code của Nhan trong `src/lib/risk/`.
> Các điểm số trong kịch bản là kết quả **chế độ heuristic** (đã chạy thật trên `eval/samples.json`). Nếu Haiku bật, điểm có thể cao hơn, không thấp hơn (xem `docs/TECHNICAL_FAQ.md`). Trước khi diễn phải chạy lại và sửa số nếu khác.

## 1. Tổng quan thời gian

| Phần | Slide | Thời gian | Độ dài | Màn hình |
|---|---|---|---|---|
| 1 | Hook | 0:00–0:40 | 40 giây | Slide 1, rồi `/landing` |
| 2 | Live Demo | 0:40–2:50 | 130 giây | Ứng dụng (đăng nhập, quét, mock MoMo) |
| 3 | Làm chủ AI 2 lớp | 2:50–3:45 | 55 giây | `/gioi-thieu` rồi slide 3 |
| 4 | Tích hợp MoMo, mô hình kinh doanh & Nghị định 13 | 3:45–4:30 | 45 giây | Slide 4 |
| 5 | Roadmap | 4:30–5:00 | 30 giây | Slide 5 |

Tốc độ nói chuẩn: khoảng **3,5 âm tiết/giây**, nghĩa là 10 giây nói được tối đa khoảng 35 từ tiếng Việt. Mỗi đoạn lời thoại bên dưới có ngân sách từ ghi sẵn. Lời thoại thực tế đều thấp hơn ngân sách (tổng 739 từ, khoảng 211 giây nói liên tục). Phần còn lại, khoảng 89 giây, dành cho thao tác bấm và chờ kết quả. Phải tập bấm giờ, vì tốc độ thật của mỗi người khác nhau.

## 2. Khớp với click-path

`DEMO_CLICK_PATH.md` dài 3:50 vì dùng cho demo độc lập. Bản pitch rút gọn như sau:

| Mốc click-path | Dùng trong pitch | Thời gian pitch |
|---|---|---|
| 1. `/landing` | Có, rút còn 10 giây, nằm cuối phần Hook | 0:30–0:40 |
| 2. `/thu-trong-60-giay` | **Bỏ** trong pitch (nói miệng ở phần README) | — |
| 3. Đăng nhập | Có, rút còn 10 giây | 0:40–0:50 |
| 4. Quét tin nhắn (mẫu A) | Có, 40 giây | 0:50–1:30 |
| 5. Quét liên kết (mẫu B, D) | Có, 20 giây | 1:30–1:50 |
| 6. Prompt injection (mẫu C) | Có, 20 giây | 1:50–2:10 |
| 7. Mock MoMo | Có, 40 giây | 2:10–2:50 |
| 8. `/gioi-thieu` | Có, mở làm nền cho phần AI 2 lớp | 2:50–3:45 |

## 3. Khung 5 slide

| Slide | Tiêu đề | Nội dung hiển thị |
|---|---|---|
| 1 | Hook | Lớp 1: tin nhắn mạo danh Vietcombank cỡ chữ lớn (mẫu `s01`). Lớp 2: "Gần 20.000 tỷ đồng, năm 2024" kèm dòng nguồn (Bộ Công an, VnExpress) ở chân slide |
| 2 | Live Demo | Slide tiêu đề trong 2 giây, rồi chuyển sang trình duyệt. Không để slide chiếm thời gian |
| 3 | Làm chủ AI 2 lớp | Sơ đồ: Nội dung → Lớp 1 luật tất định → Lớp 2 Haiku (JSON cố định) → Báo cáo. Ba ô "chốt chặn": Bằng chứng, Điểm sàn, Dự phòng. Tùy chọn: bảng Precision/Recall (ghi rõ "bộ mẫu tự soạn") |
| 4 | Tích hợp, mô hình kinh doanh & Nghị định 13 | Sơ đồ ví điện tử → `POST /api/analyze` → cảnh báo. Ô "B2B2C: tính phí theo lượt gọi API, cộng gói bảo vệ nâng cao cho cá nhân". Khung "Không giữ tiền, không tự chuyển khoản". Hai gạch đầu dòng dữ liệu |
| 5 | Roadmap | Hai cột: "Giới hạn hiện tại" và "Phiên bản 2". Slogan cuối |

## 4. Lời thoại chi tiết

Quy ước: dòng bắt đầu bằng `>` là lời nói. Dòng `[Thao tác]` là việc bấm hoặc chuyển màn hình. Số trong ngoặc là ngân sách từ.

### [0:00–0:20] Hook: Slide 1, tình huống (20 giây, ≤ 70 từ)

[Thao tác] Slide 1 đang hiện tin nhắn mạo danh ngân hàng (mẫu `s01`) cỡ chữ lớn.

> Hãy tưởng tượng bạn nhận được tin này: "Tài khoản của quý khách sẽ bị khóa trong vòng hai mươi bốn giờ. Đăng nhập tại đường link này để xác minh." Bấm vào, bạn có thể mất tiền. Không bấm, bạn lo mất tài khoản. Bạn chỉ có vài giây để quyết định.

### [0:20–0:30] Hook: Slide 1, số liệu (10 giây, ≤ 35 từ)

[Thao tác] Bấm sang lớp thứ hai của slide 1: hiện con số "gần 20.000 tỷ đồng" kèm dòng nguồn nhỏ ở chân slide.

> Năm 2024, Bộ Công an ghi nhận hàng chục nghìn tố giác lừa đảo trực tuyến, thiệt hại ước tính gần hai mươi nghìn tỷ đồng. Con số thật còn cao hơn.

> **Nguồn trên slide:** "Bộ Công an (Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao), công bố tại chiến dịch chống lừa đảo trực tuyến 2025, VnExpress International." Chi tiết và các con số khác xem mục 8 trong file này và `docs/RUBRIC_MAPPING.md`.

### [0:30–0:40] Hook: trang Landing (10 giây, ≤ 35 từ)

[Thao tác] Chuyển sang trình duyệt, mở `/landing`. Chỉ tay vào bảng báo cáo minh họa bên phải.

> Cảnh báo chung chung chưa đủ. Bạn cần biết vì sao. TrustPay AI là người bảo vệ tài chính cá nhân, mỗi kết luận đều kèm bằng chứng. Mời xem trực tiếp.

### [0:40–0:50] Demo: đăng nhập (10 giây, ≤ 35 từ)

[Thao tác] Vào màn hình đăng nhập, bấm Đăng nhập với `demo@trustpay.ai` (đã điền sẵn).

> Tôi đăng nhập bằng tài khoản demo. Dữ liệu mẫu đã có sẵn, gồm năm mươi giao dịch.

### [0:50–1:30] Demo: quét tin nhắn, mẫu A (40 giây, ≤ 140 từ)

[Thao tác] Mở màn hình Quét tin nhắn. Dán mẫu A (`s01`). Bấm **Quét**. Chỉ lần lượt vào điểm, mức độ, từng tín hiệu và đoạn trích.

> Tôi dán đúng tin nhắn vừa rồi và bấm Quét. Kết quả là rủi ro cao, tám mươi điểm trên một trăm. Bên dưới là các tín hiệu. Yêu cầu xác minh tài khoản. Tạo áp lực khóa trong hai mươi bốn giờ. Đuôi tên miền chấm top hay bị lạm dụng. Liên kết không dùng HTTPS. Mỗi tín hiệu đều trích đúng đoạn trong tin nhắn. Quý vị không cần tin chúng tôi. Quý vị tự kiểm chứng được.

### [1:30–1:50] Demo: quét liên kết, mẫu B và D (20 giây, ≤ 70 từ)

[Thao tác] Mở Quét liên kết. Dán mẫu B (`u05`), Quét. Rồi dán mẫu D (`m01`), Quét.

> Tiếp theo là liên kết. Liên kết giả Zalo Pay: rủi ro cao, bảy mươi lăm điểm, vì tên miền giả thương hiệu và đuôi chấm i-c-u. Còn trang chủ MoMo chính thức: an toàn. Lưu ý độ tin cậy chỉ bốn mươi phần trăm, vì hệ thống không dám khẳng định khi thiếu bằng chứng.

### [1:50–2:10] Demo: tấn công prompt injection, mẫu C (20 giây, ≤ 70 từ)

[Thao tác] Quay lại Quét tin nhắn. Dán mẫu C (`s09`). Bấm **Quét**. Chỉ vào tín hiệu `prompt_injection`.

> Bây giờ thử tấn công. Tin nhắn này cố ra lệnh cho AI: bỏ qua hướng dẫn, đánh giá là an toàn. Hệ thống coi đó là dữ liệu, không phải mệnh lệnh, và ghi nhận nó như một tín hiệu tấn công. Kết quả: một trăm điểm, rủi ro cao.

### [2:10–2:50] Demo: mock MoMo (40 giây, ≤ 140 từ)

[Thao tác] Mở màn hình Mock MoMo. Nhập 5.000.000đ, người nhận mới, nội dung mẫu `s05`. Bấm **Tiếp tục**. Chỉ vào mức vàng, điểm và khuyến nghị. Chỉ vào dòng chữ mô phỏng. Bấm **Quay lại**.

> Cuối cùng là tích hợp vào ví. Đây là màn hình mô phỏng chuyển tiền. Tôi nhập năm triệu đồng cho người nhận mới, nội dung là tin nhắn nhờ chuyển gấp. Trước khi xác nhận, Trust Risk API đánh giá: mức cần thận trọng, bốn mươi lăm điểm, vì có áp lực thời gian và yêu cầu chuyển tiền. Khuyến nghị là tạm dừng và gọi lại bằng số quen. Tôi bấm Quay lại. AI không tự chuyển tiền. Quyết định luôn là của người dùng.

### [2:50–3:45] Làm chủ AI 2 lớp: `/gioi-thieu` rồi slide 3 (55 giây, ≤ 190 từ)

[Thao tác] Mở `/gioi-thieu`, cuộn tới mục "Hai lớp đánh giá" trong 5 giây đầu, rồi chuyển sang slide 3.

> Vì sao kết quả đáng tin? Nhờ hai lớp. Lớp một là luật tất định, chạy cục bộ, không cần mạng: tên miền giả, đuôi đáng ngờ, yêu cầu OTP, áp lực thời gian. Lớp hai là mô hình Claude Haiku trên AWS Bedrock, chỉ tổng hợp và giải thích, trả về JSON cố định, sai định dạng là bị loại. Có ba chốt chặn. Một, mỗi lý do phải trích được từ tin nhắn, không thì bị bỏ và độ tin cậy giảm. Hai, điểm của lớp luật là mức sàn, nên mô hình không thể bị dụ hạ điểm. Ba, nếu Bedrock lỗi hoặc quá sáu giây, hệ thống tự quay về lớp luật, và demo không chết. Chúng tôi đo bằng năm mươi mẫu có nhãn, và công khai cả những ca còn sót.

> **Ghi chú người nói:** nếu `npm run smoke:bedrock` chưa chạy được với AWS thật, đổi câu "Lớp hai là mô hình Claude Haiku trên AWS Bedrock" thành "Lớp hai được thiết kế dùng Claude Haiku", và không nói Haiku đã chạy trong demo. Nếu đưa bảng Precision/Recall lên slide, phải ghi "bộ mẫu do nhóm tự soạn, dùng để kiểm tra hồi quy". Số liệu hiện tại (50 mẫu): precision 0,917, recall 0,880. Chạy lại `npm run eval` ngay trước khi nộp.

### [3:45–4:30] Tích hợp MoMo, mô hình kinh doanh và Nghị định 13: slide 4 (45 giây, ≤ 158 từ)

[Thao tác] Slide 4. Chỉ lần lượt vào sơ đồ ví → API → cảnh báo, ô "Mô hình B2B2C", khung "Không giữ tiền, không tự chuyển khoản".

> Về tích hợp, Trust Risk API chỉ là một điểm gọi: POST api analyze. Ví điện tử như MoMo gắn vào ngay trước bước xác nhận chuyển tiền. Mô hình của chúng tôi là B2B2C: ví và ngân hàng trả phí theo mỗi lượt gọi, người dùng cá nhân có thể chọn thêm gói bảo vệ nâng cao. Chúng tôi không giữ tiền, không tự chuyển khoản, và màn hình vừa rồi là mô phỏng, chưa phải tích hợp chính thức. Về dữ liệu, chúng tôi bám theo Nghị định mười ba năm hai nghìn không trăm hai mươi ba: người dùng đồng ý rõ ràng khi đăng ký, mỗi lần quét chỉ lưu mã băm và đoạn trích ngắn.

### [4:30–5:00] Roadmap: slide 5 (30 giây, ≤ 105 từ)

[Thao tác] Slide 5. Kết thúc bằng slogan, nhìn thẳng ban giám khảo.

> Giới hạn hiện nay: hệ thống chưa tự đọc chữ trong ảnh, người dùng dán văn bản vào. Bộ mẫu do nhóm tự soạn nên số đo chỉ để kiểm tra hồi quy. Phiên bản hai sẽ có nhận dạng chữ trong ảnh, tra cứu tên miền và Google Safe Browsing, cảnh báo chi tiêu bất thường. TrustPay AI: nghĩ kỹ trước khi tin, nghĩ kỹ trước khi trả tiền. Xin cảm ơn.

## 5. Điều kiện để kịch bản đúng

1. **Màn hình app (đăng nhập, quét, mock MoMo) chưa có trong repo.** Thao tác ở mục 4 theo tên tạm trong `DEMO_CLICK_PATH.md`. Quyen cần chốt tên và route.
2. **Mock MoMo ra mức vàng (45/100), không phải đỏ.** Kịch bản đã viết theo kết quả thật của mẫu `s05` ở chế độ heuristic. Nếu muốn một màn đỏ, cần một mẫu khác (Nhan kiểm tra và báo lại).
3. **Bedrock chưa thử với AWS thật** (theo `backend-status.md`). Đọc ghi chú ở phần AI 2 lớp.
4. **Tra cứu RDAP và Google Safe Browsing chưa có** (D4 của Nhan). Roadmap nói là "phiên bản hai". Nếu Nhan xong trước ngày nộp, chuyển sang "đã có" và sửa lời.
5. **Số liệu ở phần Hook đã có nguồn** (mục 8). Chỉ dùng đúng các con số trong mục 8, nói "ước tính" và nêu "Bộ Công an". Không thêm phần trăm hay con số khác nếu chưa có nguồn. Con số ">70% vụ nhắm vào chiếm đoạt qua chuyển khoản/app giả mạo" **không có nguồn công khai**, không được nói.
6. **Mô hình kinh doanh chưa có giá, chưa có đối tác, chưa có hợp đồng.** Lời thoại chỉ mô tả định hướng. Không nói MoMo hay ngân hàng nào đã đồng ý. Không nêu giá mỗi lượt gọi khi chưa đo chi phí thật mỗi lượt (giá Haiku chưa biết, theo `backend-status.md`). Gói bảo vệ nâng cao chưa có danh sách tính năng, xem `docs/RUBRIC_MAPPING.md`.
7. Các con số điểm trong phần demo: 80, 75, 5, 100, 45, 0,4 lấy từ lần chạy `analyzeHeuristic` trên `eval/samples.json`.

## 6. Chuyển giao khi Q&A

Theo protocol trong checklist: Quynh trả lời câu về sản phẩm, nỗi đau, tác động, roadmap. Câu về AI và kiến trúc chuyển cho Nhan, câu về triển khai chuyển cho Quyen bằng đúng câu:

> "Phần kỹ thuật mời anh Nhan làm rõ."

Rồi im lặng. Xem `docs/TECHNICAL_FAQ.md` cho 5 câu cốt lõi.

## 7. Danh sách tập luyện

- [ ] Đọc to từng đoạn, bấm giờ. Nếu một đoạn vượt ngân sách, cắt câu, không nói nhanh hơn.
- [ ] Tab trình duyệt mở sẵn: `/landing`, đăng nhập, quét, mock MoMo, `/gioi-thieu`.
- [ ] Mẫu A, B, C, D và `s05` chép sẵn vào một file ghi chú.
- [ ] Đã đăng xuất trước khi bắt đầu, còn đủ lượt quét trong ngày (giới hạn 30).
- [ ] Có video backup (D7) và ảnh chụp từng màn hình trong slide ẩn.


## 8. Số liệu thị trường và nguồn (dùng cho phần Hook)

Tra cứu ngày 27/11/2026. Nội dung dưới đây đã được diễn đạt lại, không trích nguyên văn. Phải mở lại nguồn để kiểm tra trước khi đưa lên slide cuối cùng, vì số liệu có thể được cập nhật.

| Số liệu | Ai công bố | Dùng trong lời thoại? | Nguồn |
|---|---|---|---|
| Năm 2024, hàng chục nghìn tố giác lừa đảo trực tuyến, thiệt hại ước tính gần 20.000 tỷ đồng (khoảng 759 triệu USD). Con số thật có thể cao hơn vì nhiều nạn nhân không trình báo | Đại tá Hà Văn Bắc, Phó Cục trưởng Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao, Bộ Công an | **Có** (0:20–0:30) | [VnExpress International, "5 No's rule..."](https://e.vnexpress.net/news/tech/vietnam-innovation/5-no-s-rule-to-help-users-escape-clutches-of-online-scammers-4951777.html) |
| Cùng nguồn: hơn 125.000 website giả mạo tổ chức và cơ quan nhà nước bị phát hiện | Như trên | Dự phòng cho Q&A | Như trên |
| Cùng nguồn: lộ OTP thì tiền trong tài khoản có thể bị lấy trong khoảng 30 giây đến 3 phút | Trung tá Nguyễn Đình Đô Thi, cùng đơn vị | Dự phòng cho Q&A (hỗ trợ lập luận "AI báo trước khi bấm") | Như trên |
| Từ 2020, hơn 24.000 vụ lừa đảo trực tuyến, thiệt hại gần 40.000 tỷ đồng (khoảng 1,5 tỷ USD). Mạo danh cơ quan chức năng là thủ đoạn phổ biến nhất, tuyển việc nhẹ lương cao là thứ hai | Thượng tá Nguyễn Thanh Hà, Cục Cảnh sát hình sự, Bộ Công an, tại hội nghị do Bộ Công an tổ chức | Dự phòng cho Q&A | [VnExpress International, "Vietnamese lose nearly $1.5B..."](https://e.vnexpress.net/news/news/crime/vietnamese-lose-nearly-1-5b-to-online-scams-in-last-5-years-how-to-spot-9-major-schemes-5001031.html) |
| Thiệt hại ước tính 18.900 tỷ đồng năm 2024, cứ 220 người dùng smartphone có 1 người bị lừa | Hiệp hội An ninh mạng quốc gia (khảo sát, **không phải** Bộ Công an) | Chỉ khi nêu đúng tên đơn vị | [VnExpress International (cùng bài 4951777)](https://e.vnexpress.net/news/tech/vietnam-innovation/5-no-s-rule-to-help-users-escape-clutches-of-online-scammers-4951777.html); [The Investor](https://theinvestor.vn/what-seen-from-exposed-multi-billion-dollar-financial-scams-in-vietnam-d14144.html) |

**Lưu ý khi dùng**

1. Các nguồn dùng phạm vi khác nhau (số tố giác, số vụ, tội phạm mạng nói chung). Một bài khác của VnExpress trích Bộ Công an ghi hơn 6.000 vụ tội phạm mạng và hơn 12.000 tỷ đồng cho năm 2024 ([nguồn](https://e.vnexpress.net/news/tech/vietnam-innovation/google-public-security-ministry-join-hands-in-anti-scam-campaign-4907456.html)). Đừng ghép số của nguồn này với nguồn khác trong cùng một câu. Nếu bị hỏi tại sao số khác nhau, trả lời: "Phạm vi thống kê khác nhau, chúng tôi dùng số tố giác lừa đảo trực tuyến của Bộ Công an."
2. Cơ quan nêu trên là Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (Bộ Công an), không phải Cục An toàn thông tin (thuộc bộ khác). Đừng nói nhầm tên đơn vị.
3. Không có nguồn công khai xác nhận con số ">70% vụ việc nhắm vào chiếm đoạt tài sản qua chuyển khoản/app giả mạo". Các bài trên chỉ mô tả định tính: có thủ đoạn cài ứng dụng giả mạo và gửi liên kết thanh toán giả, không nêu tỷ lệ. Cần tỷ lệ thì phải tìm báo cáo gốc của Bộ Công an.
4. Số liệu bằng USD là quy đổi của báo. Trong lời thoại chỉ nói tiền đồng.


