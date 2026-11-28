# TrustPay AI — Frontend Specification

**Status:** ready-for-agent

## Problem Statement

Người dùng cá nhân tại Việt Nam thường xuyên đối mặt với tin nhắn, đường dẫn giả mạo thương hiệu ngân hàng/ví điện tử và các kịch bản lừa đảo chuyển tiền, nhưng thiếu một giao diện trực quan để kiểm tra rủi ro trước khi thanh toán và theo dõi bức tranh thu/chi cơ bản. Ở trạng thái hiện tại, hệ thống mới có phần backend API và chưa có giao diện người dùng (đăng nhập, đăng ký, tổng quan tài chính, quản lý/nhập sao kê giao dịch, bộ quét tin nhắn/URL kèm báo cáo giải thích được, và màn hình mô phỏng chuyển tiền MoMo), khiến người dùng và ban giám khảo chưa thể trải nghiệm luồng "60 giây thấy giá trị".

## Solution

Xây dựng toàn bộ tầng giao diện Frontend cho ứng dụng web TrustPay AI trên nền tảng Next.js App Router, kết nối trực tiếp tới các API backend sẵn có (không chỉnh sửa logic backend). Giải pháp bao gồm hệ thống Design Tokens và UI Shell thống nhất (hỗ trợ cả nhóm trang giới thiệu tĩnh của Dev C và khu vực ứng dụng cần đăng nhập), luồng xác thực với tùy chọn đăng nhập nhanh tài khoản demo, trang quản lý và import giao dịch CSV có xem trước, Dashboard tổng hợp thu/chi theo danh mục, bộ quét rủi ro 3 chế độ kèm báo cáo giải thích rõ tín hiệu/bằng chứng/độ tin cậy, và màn hình mô phỏng chuyển tiền MoMo áp dụng kiểm tra an toàn trước khi chuyển khoản theo nguyên tắc human-in-the-loop.

## User Stories

1. As a first-time visitor, I want to see a clear landing page and static info pages with a consistent visual identity, so that I understand what TrustPay AI does and how to try it within 60 seconds.
2. As a judge or demo reviewer, I want a one-click demo sign-in button on the login page, so that I can explore all authenticated features immediately without manual registration.
3. As a returning user, I want to log in with my email and password, so that I can securely access my personal transactions and risk scan tools.
4. As a new user, I want to register an account with explicit data-processing consent (referencing Nghị định 13/2023) and a link to the privacy policy, so that my account is created compliantly.
5. As an authenticated user, I want a responsive app shell with desktop sidebar and mobile navigation across Dashboard, Risk Scanner, Mock MoMo, and Transactions, so that I can switch workflows smoothly on any screen size.
6. As a user managing personal finances, I want to view my paginated transaction list with filters by type (income/expense), date range, and category, so that I can inspect specific cash flows.
7. As a user adding records manually, I want to create a new income or expense transaction from the transactions view and delete unwanted entries with confirmation, so that my transaction ledger stays accurate.
8. As a user importing bank statements, I want to upload a CSV file and preview the first 5–10 rows before submitting, so that I can verify the columns look right before importing.
9. As a user after CSV import, I want to see a clear summary of total rows, imported count, skipped duplicates, and per-line error reasons, so that I know exactly what succeeded or failed.
10. As a user with uncategorized transactions, I want a button to trigger automatic rule-based categorization, so that uncategorized entries are grouped without manual effort.
11. As a user reviewing my finances, I want a Dashboard showing total income, total expense, net balance, and an expense-by-category chart, so that I get an immediate overview of my spending after importing transactions.
12. As a user checking suspicious content, I want a unified Scanner page with tabs for Messages, URLs, and Image Text (`image_text`), plus quick sample presets, so that I can test or scan real suspicious inputs effortlessly.
13. As a user who submitted content to scan, I want to see loading skeletons while waiting and an inline Explainable Report beside or below the input, so that I stay in flow without losing context.
14. As a user reading a risk report, I want to see the risk score (0–100), risk level badge, list of detected signals with quoted evidence, actionable recommendation, confidence percentage, and analysis engine badge (Haiku or Heuristic), so that I understand why a message or link was flagged.
15. As a user receiving a "safe" scan verdict, I want the UI to state that no clear risk signals were found (never claiming "100% safe") and note when low evidence lowers confidence, so that I remain appropriately cautious.
16. As a user scanning repeatedly in a session, I want a local session history of my recent scan results, so that I can revisit previous checks without re-submitting them.
17. As a user who hits the daily scan quota (30 scans/day), I want a clear, friendly Vietnamese rate-limit message, so that I know why the scan was blocked and when I can scan again.
18. As a user testing pre-transfer protection, I want a Mock MoMo transfer screen with recipient, amount, related message/link, quick scam/safe scenarios, and a clear simulation disclaimer banner, so that I understand TrustPay never holds or moves real money.
19. As a user about to transfer money on Mock MoMo, I want a "Check Safety" button that runs pre-transfer risk analysis and displays any warnings and reasons before confirmation, so that I can pause before sending money to a scammer.
20. As a warned user on Mock MoMo, I want clear "Cancel Transfer" and "I understand the risk, proceed anyway" actions where proceeding only shows a simulated confirmation state without altering real balances or DB records, so that the human remains in control without polluting ledger data.
21. As a user facing empty data, network errors, or unauthorized states, I want clear empty states, actionable error messages, and proper redirects to login, so that I never encounter dead clicks or blank screens.

## Implementation Decisions

- **Design System & Visual Tokens**: Adopt a light-first Fintech palette (Trust Navy/Teal primary, neutral light surfaces, explicit semantic colors for Safe/Caution/High risk) built with Tailwind CSS and shadcn/ui components, using Vietnamese-capable typography (Be Vietnam Pro / Inter) and lucide-react icons. Reserve a distinct MoMo Pink accent palette for the Mock MoMo simulation screen.
- **Route Architecture & Layout Separation**: Separate public static pages into a marketing route group (minimal top navigation with placeholder pages for landing, how-to-try, about, and privacy so static content can drop in cleanly) and authenticated features into an app route group (shared responsive shell with desktop sidebar and mobile navigation linking Dashboard, Risk Scanner, Mock MoMo, and Transactions).
- **Authentication & Consent Flow**: Integrate login with NextAuth Credentials provider plus a one-click Demo Account button using the seeded demo credentials. Integrate registration with the backend register endpoint, enforcing a mandatory consent checkbox linked to the privacy policy. Protect authenticated views and redirect unauthenticated requests cleanly to the login page.
- **Client-Side Dashboard Aggregation**: Because no dedicated backend aggregation endpoint exists and backend files must remain untouched, compute Dashboard KPIs (total income, total expense, net balance) and category breakdowns on the frontend by fetching from the existing paginated transactions API (iterating pages if total exceeds the per-page limit) and rendering charts with Recharts.
- **Transactions & CSV Preview**: Provide server-backed filtering (transaction type, date range) and pagination alongside client-side category filtering on loaded rows, manual creation modal/form, deletion with confirmation, auto-categorization trigger, and a client-side CSV preview parser for the first 5–10 rows (handling common delimiters and UTF-8 BOM) prior to multipart upload.
- **Inline Risk Scanner & Report**: Consolidate all three backend-supported scan types (message, url, image_text) into tabs on a single scanner workspace with one-click test presets and an inline report panel. Persist recent scan outputs in browser session/local storage for quick reference during a session. Enforce cautious UX copy on low-signal results, surface confidence and engine metadata transparently, and map HTTP 429 responses to a localized daily-limit notice.
- **Mock MoMo Pre-Transfer Simulation**: Compose recipient, amount, and optional message/link fields into the analysis request with the pre-transfer context flag. Display the mandatory simulation disclaimer banner prominently. Branch post-analysis actions into cancellation or a strictly simulated confirmation state that performs no database mutation or fund transfer.
- **Staging & Environment Policy**: Verify real database connectivity via the health endpoint and seeded demo login locally first, keep all secrets out of version control, and execute git commits or deployment steps only upon explicit user request.

## Testing Decisions

- **Testing Philosophy**: Verify external user-visible behavior and API integration boundaries rather than internal React state or styling implementation details.
- **Primary Seam (End-to-End / Smoke Verification)**: Validate complete user journeys against a live running app and real Postgres database: login/demo login, registration consent validation, CSV upload + transaction CRUD + categorization, Dashboard totals matching imported/seeded data, Scanner 3-tab analysis + rate-limit handling, and Mock MoMo pre-transfer warning flow across desktop and mobile viewports.
- **Secondary Seam (Unit Tests for Client Pure Logic)**: Test pure helper functions—dashboard aggregation/grouping, CSV preview row parsing, and Mock MoMo payload formatting—using the project's existing `tsx --test` runner pattern.
- **Build & Static Quality Gates**: Enforce zero TypeScript errors (`tsc --noEmit`), zero ESLint warnings/errors, and a clean production Next.js build before submission.

## Out of Scope

- Modifying Dev A's backend API routes, Prisma schema, or risk engine logic (including adding new backend endpoints such as dashboard summary, scan history GET, or chat API).
- Authoring final marketing copy and layout content for the 4 static pages owned by Dev C (only consistent layout tokens and placeholder views are included).
- All v2 roadmap features: automatic image OCR, multi-turn/general AI financial assistant chat, budget/spending alerts, anomaly detection, savings goals, recurring transactions, Gmail monitoring, and SES email alerts.
- Real payment execution, wallet balance management, or money movement on the Mock MoMo screen.

## Further Notes

- Submission deadline is 03/12/2026 (live URL must remain active ~16 days through finals on 11/12/2026).
- All user-facing copy must default to Vietnamese with accessible labels and contrast.
- Before implementation begins, verify local `.env` connectivity against Supabase (`GET /api/health`) and seed state.
