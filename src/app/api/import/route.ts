import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { ImportFormatError, MAX_IMPORT_BYTES } from "@/lib/transactions/import-csv";
import { importCsv } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

/** multipart/form-data with a `file` field (CSV, max 1 MB, 2000 rows). */
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_IMPORT_BYTES + 10_000) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (!(file instanceof File)) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  if (file.size > MAX_IMPORT_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  try {
    const summary = await importCsv(userId, await file.text());
    return NextResponse.json(summary);
  } catch (e) {
    if (e instanceof ImportFormatError) {
      return NextResponse.json({ error: "invalid_format", message: e.message }, { status: 422 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
