import test from "node:test";
import assert from "node:assert/strict";
import { mapAuthApiError, validateRegisterInput } from "./auth-form";

test("validateRegisterInput rejects missing consent (Nghi dinh 13/2023)", () => {
  const res = validateRegisterInput({
    name: "Quyen",
    email: "quyen@example.com",
    password: "Password123",
    confirmPassword: "Password123",
    consent: false,
  });
  assert.equal(res.ok, false);
  if (!res.ok) {
    assert.match(res.error, /Nghị định 13\/2023|đồng ý/i);
  }
});

test("validateRegisterInput rejects mismatched passwords and short password", () => {
  const shortRes = validateRegisterInput({
    email: "quyen@example.com",
    password: "123",
    confirmPassword: "123",
    consent: true,
  });
  assert.equal(shortRes.ok, false);

  const mismatchRes = validateRegisterInput({
    email: "quyen@example.com",
    password: "Password123",
    confirmPassword: "Password456",
    consent: true,
  });
  assert.equal(mismatchRes.ok, false);
});

test("validateRegisterInput normalizes email and optional name when valid", () => {
  const res = validateRegisterInput({
    name: "   ",
    email: "  Quyen@Example.COM ",
    password: "Password123",
    confirmPassword: "Password123",
    consent: true,
  });
  assert.deepEqual(res, {
    ok: true,
    data: {
      email: "quyen@example.com",
      password: "Password123",
      name: undefined,
      consent: true,
    },
  });
});

test("mapAuthApiError maps known status/error codes to Vietnamese copy", () => {
  assert.match(mapAuthApiError(409, "email_exists"), /đã được đăng ký/i);
  assert.match(mapAuthApiError(400, "invalid_input"), /chưa hợp lệ/i);
  assert.match(mapAuthApiError(500, "server_error"), /máy chủ|thử lại/i);
});
