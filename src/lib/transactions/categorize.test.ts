import assert from "node:assert/strict";
import { test } from "node:test";
import { categorizeByRules } from "./categorize";

const cases: Array<[string, "income" | "expense", string | null]> = [
  ["Cà phê Highlands", "expense", "food"],
  ["GrabFood đơn 123", "expense", "food"],
  ["Grab đi làm", "expense", "transport"],
  ["Đổ xăng Petrolimex", "expense", "transport"],
  ["Tiền điện tháng 10", "expense", "bills"],
  ["Netflix", "expense", "entertainment"],
  ["Shopee đơn hàng", "expense", "shopping"],
  ["Nhà thuốc Long Châu", "expense", "health"],
  ["Học phí IELTS", "expense", "education"],
  ["Chuyển khoản cho mẹ", "expense", "transfer"],
  ["Lương tháng 11", "income", "income"],
  ["Thanh toán linh tinh", "expense", null],
  ["mua hang shopee.com", "expense", "shopping"],
];

test("rule-based categories", () => {
  for (const [desc, type, expected] of cases) {
    assert.equal(categorizeByRules(desc, type), expected, desc);
  }
});
