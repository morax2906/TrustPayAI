import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { categorizeUncategorized } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

/** Applies keyword rules to the signed-in user's uncategorized transactions. */
export async function POST() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await categorizeUncategorized(userId));
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
