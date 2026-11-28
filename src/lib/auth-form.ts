export type RegisterFormRaw = {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
  consent: true;
};

export type ValidationResult =
  | { ok: true; data: RegisterPayload }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates registration fields on the client before calling POST /api/auth/register. */
export function validateRegisterInput(raw: RegisterFormRaw): ValidationResult {
  const email = raw.email.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Vui lòng nhập địa chỉ email hợp lệ." };
  }
  if (raw.password.length < 8 || raw.password.length > 128) {
    return { ok: false, error: "Mật khẩu phải từ 8 đến 128 ký tự." };
  }
  if (raw.password !== raw.confirmPassword) {
    return { ok: false, error: "Mật khẩu xác nhận không khớp." };
  }
  if (!raw.consent) {
    return {
      ok: false,
      error: "Bạn cần đồng ý xử lý dữ liệu cá nhân (Nghị định 13/2023) để tiếp tục.",
    };
  }
  const trimmedName = raw.name?.trim();
  if (trimmedName && trimmedName.length > 100) {
    return { ok: false, error: "Họ tên không được vượt quá 100 ký tự." };
  }

  return {
    ok: true,
    data: {
      email,
      password: raw.password,
      name: trimmedName ? trimmedName : undefined,
      consent: true,
    },
  };
}

/** Maps backend registration HTTP status/error codes to user-friendly Vietnamese messages. */
export function mapAuthApiError(status: number, errorCode?: string): string {
  if (status === 409 || errorCode === "email_exists") {
    return "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.";
  }
  if (status === 400 || errorCode === "invalid_input" || errorCode === "invalid_json") {
    return "Thông tin đăng ký chưa hợp lệ. Vui lòng kiểm tra lại các trường.";
  }
  return "Không thể kết nối máy chủ. Vui lòng thử lại sau.";
}
