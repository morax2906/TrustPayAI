> **Tài liệu lịch sử/tầm nhìn (archived).** Đây là đề xuất kinh doanh ở mức tầm nhìn, KHÔNG phải phạm vi build. Phạm vi MVP chính thức tuân theo `.kiro/steering/product.md` và `DEVELOPMENT_PLAN.md`. Các mục trong tài liệu này (AI Financial Assistant, Gmail monitoring, OCR, anomaly detection, budget...) thuộc roadmap, không nằm trong P0.

# TRUSTPAY AI — ĐỀ XUẤT ỨNG DỤNG

**Tên ứng dụng:** TrustPay AI — Your Personal AI Financial Guardian  
**Tagline:** Think Before You Trust. Think Before You Pay.  
**Định hướng:** Trợ lý AI tài chính cá nhân, kết hợp phòng chống lừa đảo và quản lý dòng tiền.

---

# I. GIỚI THIỆU VÀ MỤC TIÊU ỨNG DỤNG

## 1. Giới thiệu ứng dụng

TrustPay AI là ứng dụng trợ lý AI tài chính cá nhân, hướng đến việc giúp người dùng **bảo vệ tài sản, nhận diện nguy cơ lừa đảo và quản lý thu nhập – chi tiêu hiệu quả hơn**.

Ứng dụng kết hợp hai nhóm năng lực chính:

- **Protect My Money – Bảo vệ tiền:** Chủ động phân tích email, tin nhắn, đường dẫn và các tín hiệu giao dịch để phát hiện dấu hiệu lừa đảo hoặc hoạt động bất thường.
- **Manage My Money – Quản lý tiền:** Ghi nhận thu nhập, chi tiêu, phân loại giao dịch, theo dõi ngân sách và phân tích dòng tiền cá nhân.

Thay vì chỉ hoạt động khi người dùng gửi một nội dung đáng ngờ để kiểm tra, TrustPay AI hướng đến khả năng chủ động xử lý các sự kiện mà người dùng đã cho phép kết nối, chẳng hạn email mới hoặc dữ liệu giao dịch được nhập vào hệ thống. AI sẽ phân tích dữ liệu, tổng hợp các tín hiệu liên quan và gửi cảnh báo hoặc đề xuất phù hợp.

Ví dụ, khi người dùng kết nối Gmail và cấp quyền cần thiết, hệ thống có thể nhận biết email mới, trích xuất nội dung và đường dẫn, kiểm tra dấu hiệu giả mạo rồi gửi cảnh báo nếu phát hiện rủi ro. Khi người dùng nhập sao kê hoặc kết nối một nguồn dữ liệu giao dịch được hỗ trợ, hệ thống có thể tự động ghi nhận giao dịch, phân loại khoản thu – chi và cập nhật báo cáo dòng tiền.

## 2. Vấn đề cần giải quyết

Người dùng cá nhân thường gặp hai nhóm vấn đề:

### 2.1. Rủi ro an toàn tài chính

- Email, SMS hoặc tin nhắn giả mạo ngân hàng, đơn vị vận chuyển, sàn thương mại điện tử.
- Đường dẫn dẫn đến website giả mạo hoặc trang thu thập thông tin đăng nhập.
- Yêu cầu chuyển khoản, thanh toán hoặc cung cấp thông tin với lý do khẩn cấp.
- Khó nhận biết người nhận mới hoặc giao dịch có đặc điểm bất thường.
- Người dùng thường chỉ kiểm tra khi đã nghi ngờ, thay vì được cảnh báo sớm.

### 2.2. Khó khăn trong quản lý tài chính cá nhân

- Không nắm rõ tổng thu nhập và chi tiêu trong tháng.
- Khó phân loại giao dịch thành các nhóm như ăn uống, mua sắm, di chuyển, hóa đơn.
- Không nhận biết kịp thời khi một danh mục chi tiêu vượt ngân sách.
- Thiếu cái nhìn tổng quan về dòng tiền và số tiền còn lại.
- Khó tìm nguyên nhân khiến chi tiêu tăng so với các kỳ trước.

## 3. Mục tiêu ứng dụng

1. **Phát hiện sớm rủi ro:** Hỗ trợ nhận diện dấu hiệu lừa đảo từ email, tin nhắn, URL, hình ảnh và dữ liệu giao dịch được người dùng cho phép phân tích.
2. **Chủ động cảnh báo:** Tự động xử lý sự kiện từ các nguồn đã kết nối và thông báo khi phát hiện tín hiệu đáng ngờ.
3. **Tự động hóa quản lý giao dịch:** Ghi nhận và phân loại các khoản thu – chi từ dữ liệu được người dùng cung cấp hoặc nguồn tích hợp hợp lệ.
4. **Minh bạch dòng tiền:** Cung cấp báo cáo thu nhập, chi tiêu, ngân sách và số dư dòng tiền theo ngày, tuần, tháng.
5. **Hỗ trợ ra quyết định:** Cho phép người dùng hỏi AI về tình hình tài chính và nhận đề xuất dựa trên dữ liệu đã ghi nhận.
6. **Đảm bảo quyền kiểm soát của người dùng:** Người dùng chủ động cấp, giới hạn và thu hồi quyền truy cập dữ liệu; AI chỉ phân tích, cảnh báo và đề xuất, không tự thực hiện giao dịch chuyển tiền.

## 4. Đối tượng người dùng

- Cá nhân thường xuyên mua sắm và thanh toán trực tuyến.
- Người dùng thường xuyên nhận email, SMS hoặc thông báo giao dịch từ ngân hàng.
- Sinh viên, nhân viên văn phòng và người trẻ muốn quản lý chi tiêu cá nhân.
- Người muốn theo dõi ngân sách, tiết kiệm và phát hiện các khoản chi bất thường.
- Người cần một công cụ hỗ trợ kiểm tra thông tin trước khi thanh toán hoặc chuyển tiền.

## 5. Giá trị cốt lõi

| Giá trị | Mô tả |
|---|---|
| Chủ động bảo vệ | Phân tích dữ liệu từ các nguồn được cấp quyền và cảnh báo khi có dấu hiệu rủi ro. |
| Quản lý tập trung | Tổng hợp thu nhập, chi tiêu và giao dịch vào một hệ thống. |
| AI hỗ trợ ra quyết định | Giải thích các dấu hiệu, phân tích xu hướng và đưa ra đề xuất dễ hiểu. |
| Cá nhân hóa | Phân tích thói quen chi tiêu và ngưỡng cảnh báo của từng người dùng. |
| Người dùng làm chủ dữ liệu | Cho phép quản lý kết nối, quyền truy cập và dữ liệu được lưu trữ. |

---

# II. QUY TRÌNH NGHIỆP VỤ

## 1. Quy trình tổng thể

TrustPay AI hoạt động theo hai luồng nghiệp vụ chính:

- **Luồng A – Protect My Money:** Tiếp nhận sự kiện hoặc nội dung, phân tích rủi ro và cảnh báo.
- **Luồng B – Manage My Money:** Tiếp nhận dữ liệu giao dịch, ghi nhận thu – chi, phân loại và phân tích dòng tiền.

Hai luồng có thể kết hợp khi hệ thống phát hiện giao dịch bất thường và đối chiếu với các dấu hiệu rủi ro đã ghi nhận trước đó.

## 2. Luồng A – Phòng chống lừa đảo chủ động

### 2.1. Kết nối nguồn dữ liệu

1. Người dùng đăng nhập TrustPay AI.
2. Người dùng chọn kết nối Gmail hoặc sử dụng chức năng gửi nội dung cần kiểm tra.
3. Với Gmail, người dùng đăng nhập Google và chấp thuận các quyền truy cập được giải thích rõ ràng.
4. Người dùng có thể ngắt kết nối hoặc thu hồi quyền bất cứ lúc nào.

### 2.2. Tiếp nhận nội dung

Hệ thống tiếp nhận dữ liệu từ một trong các nguồn:

- Email mới từ Gmail đã được người dùng cấp quyền.
- Tin nhắn, nội dung văn bản hoặc URL do người dùng gửi.
- Hình ảnh hoặc ảnh chụp màn hình được người dùng tải lên.
- Dữ liệu giao dịch từ nguồn tích hợp hoặc tệp sao kê người dùng nhập.

Đối với Gmail, cơ chế thông báo thay đổi hộp thư có thể được sử dụng để kích hoạt quá trình kiểm tra email mới. Hệ thống chỉ xử lý hộp thư và phạm vi dữ liệu mà người dùng đã cho phép.

### 2.3. Phân tích bằng AI Agent

1. Xác định loại dữ liệu đầu vào.
2. Trích xuất nội dung, người gửi, URL và thông tin liên quan.
3. AI Agent lựa chọn công cụ phân tích phù hợp:
   - NLP Scanner: phân tích nội dung và ngôn ngữ đáng ngờ.
   - URL Scanner: kiểm tra đặc điểm và tín hiệu rủi ro của đường dẫn.
   - OCR Engine: trích xuất văn bản từ hình ảnh.
   - Risk Assessment Engine: tổng hợp tín hiệu và xác định mức độ rủi ro.
4. Hệ thống lưu kết quả phân tích cần thiết và bằng chứng hỗ trợ.

### 2.4. Cảnh báo và đề xuất

- Nếu không phát hiện tín hiệu đáng ngờ đáng kể, hệ thống lưu kết quả theo cấu hình của người dùng.
- Nếu có tín hiệu cần chú ý, hệ thống gửi cảnh báo và giải thích lý do.
- Nếu rủi ro cao, hệ thống đề xuất người dùng không mở liên kết, không cung cấp thông tin hoặc không thanh toán trước khi xác minh qua kênh chính thức.
- Người dùng có thể đánh dấu kết quả đúng, sai hoặc cần xem xét lại để cải thiện trải nghiệm.

**Đầu ra:** Báo cáo phân tích gồm mức độ rủi ro, tín hiệu phát hiện, nội dung chưa xác minh và khuyến nghị an toàn.

## 3. Luồng B – Quản lý thu nhập và dòng tiền

### 3.1. Kết nối hoặc nhập dữ liệu giao dịch

Người dùng có thể đưa dữ liệu vào hệ thống qua các phương thức:

- Kết nối nguồn dữ liệu giao dịch được hỗ trợ và được người dùng cho phép.
- Đọc email thông báo biến động số dư qua Gmail sau khi được cấp quyền phù hợp.
- Tải lên tệp sao kê do ngân hàng cung cấp.
- Thêm giao dịch thủ công.

Không mặc định mọi ngân hàng đều cung cấp API cho ứng dụng bên thứ ba. Khả năng kết nối tự động phụ thuộc vào ngân hàng, nhà cung cấp tích hợp, phạm vi cấp quyền và điều kiện triển khai.

### 3.2. Trích xuất và chuẩn hóa giao dịch

Hệ thống trích xuất các trường thông tin có thể có:

- Thời gian giao dịch.
- Số tiền.
- Loại giao dịch: thu hoặc chi.
- Tài khoản hoặc nguồn giao dịch (nếu dữ liệu được cung cấp).
- Người gửi hoặc người nhận (nếu có).
- Nội dung chuyển khoản.
- Số dư sau giao dịch (nếu nguồn dữ liệu có cung cấp).

Hệ thống chuẩn hóa định dạng ngày giờ, tiền tệ và nội dung giao dịch; đồng thời kiểm tra giao dịch trùng lặp để hạn chế ghi nhận nhiều lần.

### 3.3. Phân loại giao dịch

AI phân loại giao dịch vào các danh mục, ví dụ:

- Thu nhập/lương.
- Thu nhập phụ.
- Ăn uống.
- Mua sắm.
- Di chuyển.
- Hóa đơn và dịch vụ.
- Giải trí.
- Giáo dục.
- Sức khỏe.
- Chuyển tiền.
- Khác.

Người dùng có thể sửa danh mục khi hệ thống phân loại chưa chính xác.

### 3.4. Cập nhật báo cáo dòng tiền

Hệ thống tự động cập nhật:

- Tổng thu nhập trong kỳ.
- Tổng chi tiêu trong kỳ.
- Dòng tiền ròng.
- Chi tiêu theo danh mục.
- So sánh với kỳ trước.
- Ngân sách còn lại.
- Các khoản thu – chi định kỳ đã nhận diện.

### 3.5. Cảnh báo và tư vấn tài chính

- Cảnh báo khi chi tiêu tiến gần hoặc vượt ngân sách.
- Nhắc người dùng về các khoản thanh toán định kỳ nếu đã thiết lập.
- Phát hiện giao dịch có số tiền, tần suất hoặc người nhận khác thường.
- Trả lời câu hỏi về thu nhập, chi tiêu và xu hướng dòng tiền.
- Đề xuất điều chỉnh ngân sách hoặc mục tiêu tiết kiệm dựa trên dữ liệu thực tế đã ghi nhận.

**Đầu ra:** Dashboard tài chính cá nhân, lịch sử giao dịch, báo cáo dòng tiền và cảnh báo chi tiêu.

## 4. Luồng C – Kết hợp an toàn giao dịch và quản lý dòng tiền

1. Hệ thống ghi nhận một giao dịch từ nguồn dữ liệu được kết nối.
2. Risk Assessment Engine kiểm tra các tín hiệu bất thường, chẳng hạn số tiền lớn khác thường, người nhận mới hoặc tần suất giao dịch bất thường.
3. Nếu có email hoặc nội dung đáng ngờ liên quan đã được ghi nhận, hệ thống có thể đối chiếu các tín hiệu trong phạm vi dữ liệu được phép.
4. AI tổng hợp bằng chứng và đánh giá mức độ cần chú ý.
5. TrustPay AI gửi cảnh báo, nêu rõ lý do và khuyến nghị người dùng xác minh giao dịch.

Việc phát hiện giao dịch bất thường không đồng nghĩa giao dịch đó chắc chắn là lừa đảo. Hệ thống phải trình bày tín hiệu quan sát được và để người dùng tự xác minh.

## 5. Luồng D – AI Financial Assistant

1. Người dùng đặt câu hỏi bằng ngôn ngữ tự nhiên.
2. AI xác định yêu cầu thuộc nhóm an toàn tài chính hay quản lý dòng tiền.
3. AI truy xuất dữ liệu cần thiết trong phạm vi người dùng đã cấp quyền.
4. AI gọi công cụ phù hợp để thống kê hoặc phân tích.
5. AI trả lời kèm số liệu, khoảng thời gian và cơ sở của kết luận.

Ví dụ câu hỏi:
- “Tháng này tôi đã chi bao nhiêu cho ăn uống?”
- “Khoản chi nào tăng nhiều nhất so với tháng trước?”
- “Tôi còn bao nhiêu ngân sách mua sắm?”
- “Email này có dấu hiệu lừa đảo không?”
- “Giao dịch này có gì bất thường so với thói quen của tôi?”

---

# III. DANH SÁCH TÍNH NĂNG

Danh sách dưới đây mô tả các tính năng ở góc độ người dùng và nghiệp vụ. Các tính năng tự động chỉ hoạt động sau khi người dùng đã kết nối nguồn dữ liệu và cấp quyền tương ứng.

| ID | Tên tính năng | Mô tả | Mức ưu tiên |
|---|---|---|---|
| F01 | Đăng ký và đăng nhập | Tạo tài khoản, đăng nhập và quản lý phiên sử dụng. | P0 |
| F02 | Quản lý hồ sơ cá nhân | Quản lý thông tin cơ bản, tiền tệ và tùy chọn cá nhân. | P0 |
| F03 | Kết nối Gmail | Cho phép người dùng kết nối hoặc ngắt kết nối Gmail thông qua cơ chế cấp quyền. | P1 |
| F04 | Quản lý quyền dữ liệu | Xem và thu hồi quyền truy cập các nguồn dữ liệu đã kết nối. | P0 |
| F05 | AI Safety Chat | Trò chuyện với AI về tình huống lừa đảo và vấn đề tài chính cá nhân. | P0 |
| F06 | Message Scanner | Phân tích nội dung SMS, email hoặc tin nhắn do người dùng cung cấp. | P0 |
| F07 | URL Scanner | Phân tích URL để tìm tín hiệu đáng ngờ. | P0 |
| F08 | Image/OCR Scanner | Trích xuất nội dung từ ảnh chụp màn hình hoặc hình ảnh. | P1 |
| F09 | Email Monitoring | Tiếp nhận thông báo email mới từ Gmail đã kết nối và kích hoạt quy trình phân tích. | P1 |
| F10 | Proactive Scam Alert | Chủ động thông báo khi phát hiện tín hiệu rủi ro đáng chú ý. | P1 |
| F11 | Risk Assessment | Tổng hợp tín hiệu và phân loại mức độ rủi ro. | P0 |
| F12 | Explainable Risk Report | Hiển thị dấu hiệu phát hiện, mức độ chắc chắn và khuyến nghị. | P0 |
| F13 | Security History | Xem lại lịch sử kiểm tra và cảnh báo an toàn. | P1 |
| F14 | Import Bank Statement | Tải lên tệp sao kê để trích xuất giao dịch. | P0 |
| F15 | Transaction Management | Xem, thêm, sửa, xóa và quản lý giao dịch cá nhân. | P0 |
| F16 | Automatic Transaction Extraction | Trích xuất giao dịch từ email thông báo hoặc nguồn dữ liệu được hỗ trợ. | P1 |
| F17 | AI Expense Categorization | Tự động phân loại giao dịch thu – chi. | P0 |
| F18 | Income Management | Theo dõi lương, thu nhập phụ và các khoản tiền nhận được. | P0 |
| F19 | Expense Management | Theo dõi các khoản chi tiêu theo danh mục và thời gian. | P0 |
| F20 | Cash Flow Dashboard | Tổng hợp thu nhập, chi tiêu và dòng tiền ròng. | P0 |
| F21 | Budget Management | Tạo và quản lý ngân sách theo danh mục hoặc thời gian. | P1 |
| F22 | Spending Alerts | Cảnh báo khi chi tiêu gần chạm hoặc vượt ngân sách. | P1 |
| F23 | Financial Analytics | Phân tích xu hướng và so sánh thu – chi giữa các kỳ. | P1 |
| F24 | Unusual Transaction Detection | Phát hiện giao dịch có đặc điểm khác thường so với lịch sử. | P1 |
| F25 | AI Financial Assistant | Trả lời câu hỏi về thu nhập, chi tiêu, ngân sách và dòng tiền. | P1 |
| F26 | Savings Goals | Thiết lập mục tiêu tiết kiệm và theo dõi tiến độ. | P2 |
| F27 | Recurring Transaction Detection | Nhận diện khoản thu hoặc chi lặp lại theo chu kỳ. | P2 |
| F28 | Notification Preferences | Tùy chỉnh loại cảnh báo, ngưỡng cảnh báo và kênh nhận thông báo. | P1 |
| F29 | Data Export | Xuất dữ liệu giao dịch và báo cáo tài chính cá nhân. | P2 |
| F30 | Delete Account and Data | Cho phép người dùng yêu cầu xóa tài khoản và dữ liệu theo chính sách lưu trữ. | P0 |

## 1. Phạm vi MVP đề xuất

Để phù hợp với nhóm phát triển 3 thành viên, phiên bản đầu nên tập trung vào các chức năng cốt lõi:

**Nhóm an toàn tài chính**
- F05 – AI Safety Chat.
- F06 – Message Scanner.
- F07 – URL Scanner.
- F11 – Risk Assessment.
- F12 – Explainable Risk Report.

**Nhóm quản lý dòng tiền**
- F14 – Import Bank Statement.
- F15 – Transaction Management.
- F17 – AI Expense Categorization.
- F18 – Income Management.
- F19 – Expense Management.
- F20 – Cash Flow Dashboard.

**Nhóm nền tảng và quyền riêng tư**
- F01 – Đăng ký và đăng nhập.
- F02 – Quản lý hồ sơ cá nhân.
- F04 – Quản lý quyền dữ liệu.
- F30 – Xóa tài khoản và dữ liệu.

Sau khi MVP hoạt động ổn định, nhóm có thể bổ sung Gmail Monitoring, Proactive Scam Alert, Smart Budget và AI Financial Assistant.

---

# IV. PHÂN HỆ TÍNH NĂNG

Ứng dụng được chia thành 6 phân hệ nghiệp vụ chính.

## 1. Phân hệ quản lý tài khoản và quyền riêng tư

**Mục đích:** Quản lý danh tính, thiết lập cá nhân và quyền truy cập dữ liệu.

| Mã chức năng | Tên chức năng | Mô tả |
|---|---|---|
| ACC-01 | Đăng ký tài khoản | Tạo tài khoản TrustPay AI. |
| ACC-02 | Đăng nhập/Đăng xuất | Xác thực và kết thúc phiên sử dụng. |
| ACC-03 | Quản lý hồ sơ | Cập nhật thông tin và thiết lập cá nhân. |
| ACC-04 | Kết nối nguồn dữ liệu | Liên kết Gmail hoặc nguồn giao dịch được hỗ trợ. |
| ACC-05 | Quản lý quyền truy cập | Xem, giới hạn và thu hồi quyền đã cấp. |
| ACC-06 | Quản lý dữ liệu cá nhân | Yêu cầu xuất hoặc xóa dữ liệu theo chính sách. |

## 2. Phân hệ AI Assistant và điều phối tác vụ

**Mục đích:** Cung cấp giao diện giao tiếp tự nhiên và điều phối công cụ phân tích.

| Mã chức năng | Tên chức năng | Mô tả |
|---|---|---|
| AST-01 | AI Safety Chat | Tiếp nhận câu hỏi về an toàn tài chính. |
| AST-02 | AI Financial Assistant | Trả lời câu hỏi về thu nhập và dòng tiền. |
| AST-03 | Intent Understanding | Xác định mục đích và loại yêu cầu của người dùng. |
| AST-04 | Tool Orchestration | Lựa chọn NLP, OCR, URL Scanner hoặc công cụ thống kê phù hợp. |
| AST-05 | Contextual Response | Tạo câu trả lời theo ngữ cảnh và dữ liệu được phép truy cập. |
| AST-06 | Evidence-based Explanation | Nêu cơ sở và dữ liệu hỗ trợ cho kết quả phân tích. |

## 3. Phân hệ phát hiện và phòng chống lừa đảo

**Mục đích:** Phân tích nội dung và phát hiện các tín hiệu liên quan đến lừa đảo.

| Mã chức năng | Tên chức năng | Mô tả |
|---|---|---|
| SEC-01 | Message Scanner | Phân tích nội dung tin nhắn và email. |
| SEC-02 | URL Scanner | Kiểm tra tín hiệu rủi ro của đường dẫn. |
| SEC-03 | OCR Scanner | Trích xuất nội dung từ hình ảnh. |
| SEC-04 | Sender Analysis | Phân tích thông tin người gửi khi dữ liệu có sẵn. |
| SEC-05 | Risk Assessment Engine | Tổng hợp tín hiệu và phân loại mức độ rủi ro. |
| SEC-06 | Risk Report | Hiển thị kết quả, bằng chứng và khuyến nghị. |
| SEC-07 | Security History | Lưu và tra cứu lịch sử phân tích. |

## 4. Phân hệ giám sát chủ động và cảnh báo

**Mục đích:** Tự động kích hoạt phân tích từ các nguồn đã được người dùng cấp quyền và gửi cảnh báo khi cần.

| Mã chức năng | Tên chức năng | Mô tả |
|---|---|---|
| MON-01 | Gmail Integration | Kết nối Gmail thông qua cơ chế cấp quyền của Google. |
| MON-02 | Email Change Monitoring | Nhận biết thay đổi hoặc email mới từ hộp thư đã kết nối. |
| MON-03 | Automatic Email Analysis | Tự động trích xuất và phân tích email theo cấu hình người dùng. |
| MON-04 | Threat Correlation | Đối chiếu các tín hiệu liên quan trong phạm vi dữ liệu được phép. |
| MON-05 | Proactive Scam Alert | Gửi cảnh báo khi phát hiện tín hiệu đáng ngờ. |
| MON-06 | Alert Preferences | Thiết lập mức độ và loại cảnh báo muốn nhận. |
| MON-07 | Connection Status | Hiển thị trạng thái kết nối và thông báo khi kết nối cần xác thực lại. |

## 5. Phân hệ quản lý thu nhập, chi tiêu và dòng tiền

**Mục đích:** Tổng hợp giao dịch và cung cấp cái nhìn toàn diện về tài chính cá nhân.

| Mã chức năng | Tên chức năng | Mô tả |
|---|---|---|
| FIN-01 | Import Statement | Nhập tệp sao kê do người dùng tải lên. |
| FIN-02 | Transaction Extraction | Trích xuất thông tin giao dịch từ dữ liệu được cung cấp. |
| FIN-03 | Transaction Management | Thêm, xem, sửa và xóa giao dịch. |
| FIN-04 | Income Management | Ghi nhận và theo dõi các nguồn thu nhập. |
| FIN-05 | Expense Management | Theo dõi các khoản chi tiêu. |
| FIN-06 | AI Categorization | Tự động phân loại giao dịch. |
| FIN-07 | Category Management | Quản lý danh mục thu nhập và chi tiêu. |
| FIN-08 | Cash Flow Dashboard | Hiển thị tổng thu, tổng chi và dòng tiền ròng. |
| FIN-09 | Budget Management | Thiết lập ngân sách theo danh mục hoặc kỳ. |
| FIN-10 | Spending Alert | Cảnh báo vượt hoặc gần vượt ngân sách. |
| FIN-11 | Financial Analytics | Thống kê, so sánh và phân tích xu hướng. |
| FIN-12 | Savings Goals | Thiết lập và theo dõi mục tiêu tiết kiệm. |
| FIN-13 | Recurring Transactions | Nhận diện và quản lý giao dịch định kỳ. |
| FIN-14 | Data Export | Xuất giao dịch và báo cáo. |

## 6. Phân hệ phát hiện giao dịch bất thường

**Mục đích:** Kết hợp lịch sử giao dịch và tín hiệu rủi ro để giúp người dùng nhận biết hoạt động tài chính khác thường.

| Mã chức năng | Tên chức năng | Mô tả |
|---|---|---|
| ANO-01 | Transaction Pattern Analysis | Phân tích thói quen giao dịch theo số tiền, thời gian và danh mục. |
| ANO-02 | Unusual Amount Detection | Phát hiện khoản giao dịch có số tiền khác thường. |
| ANO-03 | New Recipient Detection | Nhận diện người nhận chưa xuất hiện trong lịch sử, nếu nguồn dữ liệu có thông tin. |
| ANO-04 | Frequency Anomaly Detection | Phát hiện tần suất giao dịch bất thường. |
| ANO-05 | Risk Signal Correlation | Kết hợp tín hiệu giao dịch với email hoặc nội dung đáng ngờ đã phân tích. |
| ANO-06 | Anomaly Alert | Thông báo cho người dùng về giao dịch cần xác minh. |
| ANO-07 | User Feedback | Cho phép người dùng xác nhận giao dịch hợp lệ hoặc báo cáo bất thường. |

## 7. Phạm vi và nguyên tắc triển khai

### 7.1. Nguyên tắc lấy dữ liệu

- Chỉ truy cập Gmail khi người dùng chủ động kết nối và cấp quyền.
- Chỉ sử dụng API ngân hàng hoặc nhà cung cấp trung gian khi có hỗ trợ và đáp ứng điều kiện tích hợp.
- Với MVP, ưu tiên nhập sao kê và dữ liệu giao dịch do người dùng cung cấp.
- Không yêu cầu mật khẩu ngân hàng, mã OTP hoặc thông tin xác thực nhạy cảm.
- Không xem email thông báo biến động số dư là nguồn dữ liệu đầy đủ hoặc chính xác tuyệt đối; cần có cơ chế kiểm tra và cho phép người dùng chỉnh sửa.

### 7.2. Nguyên tắc hoạt động của AI

- AI có thể tự lựa chọn công cụ phân tích và thực hiện quy trình kiểm tra trong phạm vi được cấp quyền.
- Kết quả đánh giá rủi ro phải dựa trên tín hiệu và bằng chứng có thể giải thích.
- Giao dịch bất thường không đồng nghĩa chắc chắn là giao dịch lừa đảo.
- AI chỉ cảnh báo và đề xuất; không tự động chuyển tiền, hủy giao dịch hoặc thay đổi tài khoản ngân hàng.
- Nội dung email, website và tệp người dùng cung cấp phải được xem là dữ liệu không đáng tin cậy.

### 7.3. Định hướng phát triển theo giai đoạn

| Giai đoạn | Phạm vi |
|---|---|
| MVP | Quản lý giao dịch bằng nhập sao kê/thủ công, phân loại thu – chi, dashboard dòng tiền, Message Scanner, URL Scanner và báo cáo rủi ro. |
| Giai đoạn 2 | Kết nối Gmail, tự động phân tích email mới, cảnh báo chủ động và ngân sách thông minh. |
| Giai đoạn 3 | Tích hợp nguồn giao dịch tự động phù hợp, phát hiện bất thường nâng cao, phân tích mục tiêu tiết kiệm và cá nhân hóa. |

---

**Tầm nhìn sản phẩm:** TrustPay AI không chỉ giúp người dùng biết một email hay giao dịch có đáng ngờ hay không, mà còn giúp họ hiểu tiền của mình đang đến từ đâu, được sử dụng như thế nào và cần làm gì để bảo vệ cũng như quản lý tài chính tốt hơn.
