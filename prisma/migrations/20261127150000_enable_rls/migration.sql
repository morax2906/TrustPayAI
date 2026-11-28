-- Supabase exposes the public schema through its REST API. Enable RLS with no policies so the
-- publishable key cannot read or write these tables. Prisma connects as the table owner (postgres),
-- which bypasses RLS, so the app keeps working.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ScanHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiUsage" ENABLE ROW LEVEL SECURITY;
