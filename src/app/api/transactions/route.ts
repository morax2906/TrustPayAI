import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import {
  createTransaction,
  createTransactionSchema,
  listQuerySchema,
  listTransactions,
} from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = listQuerySchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  try {
    return NextResponse.json(await listTransactions(userId, parsed.data));
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = createTransactionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  try {
    const result = await createTransaction(userId, parsed.data);
    if (!result.ok) return NextResponse.json({ error: "duplicate" }, { status: 409 });
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
