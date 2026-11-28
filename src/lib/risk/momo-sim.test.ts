import test from "node:test";
import assert from "node:assert/strict";
import { buildPreTransferPayload, formatVnd } from "./momo-sim";

test("buildPreTransferPayload formats recipient, amount and note with pre_transfer context", () => {
  const res = buildPreTransferPayload({
    recipient: "0901234567 - Nguyen Van A",
    amount: "2000000",
    note: "Đặt cọc phí xử lý hoàn tiền tại m0m0.vn.xyz",
  });
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.equal(res.payload.type, "message");
    assert.equal(res.payload.context, "pre_transfer");
    assert.match(res.payload.content, /0901234567/);
    assert.match(res.payload.content, /2\.000\.000/);
    assert.match(res.payload.content, /m0m0\.vn\.xyz/);
  }
});

test("buildPreTransferPayload works without optional note and rejects empty recipient or invalid amount", () => {
  const noNote = buildPreTransferPayload({
    recipient: "Ban Be",
    amount: "150000",
    note: "   ",
  });
  assert.equal(noNote.ok, true);
  if (noNote.ok) {
    assert.equal(noNote.payload.context, "pre_transfer");
    assert.doesNotMatch(noNote.payload.content, /Nội dung kèm theo/);
  }

  const badAmount = buildPreTransferPayload({
    recipient: "Ai Do",
    amount: "0",
    note: "",
  });
  assert.equal(badAmount.ok, false);
});

test("formatVnd formats integer VND cleanly", () => {
  assert.match(formatVnd(1500000), /1\.500\.000/);
});
