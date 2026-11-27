import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { analyze } from "@/lib/risk/analyze";
import { saveScan } from "@/lib/risk/history";
import { analyzeRequestSchema } from "@/lib/risk/schema";
import { consumeScan } from "@/lib/risk/usage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  try {
    if (!(await consumeScan(userId))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
    const result = await analyze(parsed.data);
    // History is best effort: a failed write must not hide the result from the user.
    await saveScan(userId, parsed.data, result).catch(() => undefined);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
