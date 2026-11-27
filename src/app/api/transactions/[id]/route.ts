import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { deleteTransaction } from "@/lib/transactions/service";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const deleted = await deleteTransaction(userId, params.id);
    if (!deleted) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
