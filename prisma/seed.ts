import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { buildDedupHashes, type HashInput } from "../src/lib/transactions/dedup";

const prisma = new PrismaClient();

export const DEMO_EMAIL = "demo@trustpay.ai";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "Demo@12345";

const CATEGORIES = [
  { slug: "food", name: "Ăn uống" },
  { slug: "transport", name: "Di chuyển" },
  { slug: "shopping", name: "Mua sắm" },
  { slug: "bills", name: "Hóa đơn & tiện ích" },
  { slug: "entertainment", name: "Giải trí" },
  { slug: "health", name: "Sức khỏe" },
  { slug: "education", name: "Giáo dục" },
  { slug: "transfer", name: "Chuyển khoản" },
  { slug: "income", name: "Thu nhập" },
  { slug: "other", name: "Khác" },
] as const;

type Tpl = { desc: string; amount: number; cat: string; type: "income" | "expense" };

const EXPENSES: Tpl[] = [
  { desc: "Cà phê Highlands", amount: 45000, cat: "food", type: "expense" },
  { desc: "Cơm trưa văn phòng", amount: 55000, cat: "food", type: "expense" },
  { desc: "GrabFood", amount: 120000, cat: "food", type: "expense" },
  { desc: "Phở bò", amount: 60000, cat: "food", type: "expense" },
  { desc: "Grab đi làm", amount: 78000, cat: "transport", type: "expense" },
  { desc: "Đổ xăng", amount: 150000, cat: "transport", type: "expense" },
  { desc: "Shopee đơn hàng", amount: 320000, cat: "shopping", type: "expense" },
  { desc: "Uniqlo áo thun", amount: 490000, cat: "shopping", type: "expense" },
  { desc: "Tiền điện EVN", amount: 650000, cat: "bills", type: "expense" },
  { desc: "Internet VNPT", amount: 220000, cat: "bills", type: "expense" },
  { desc: "Netflix", amount: 180000, cat: "entertainment", type: "expense" },
  { desc: "Vé xem phim CGV", amount: 190000, cat: "entertainment", type: "expense" },
  { desc: "Nhà thuốc Long Châu", amount: 135000, cat: "health", type: "expense" },
  { desc: "Khóa học online", amount: 399000, cat: "education", type: "expense" },
  { desc: "Chuyển tiền cho mẹ", amount: 1000000, cat: "transfer", type: "expense" },
];

function buildDemoRows(): (HashInput & { cat: string })[] {
  const today = new Date();
  const base = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const day = (offset: number) => new Date(base - offset * 86_400_000);
  const rows: (HashInput & { cat: string })[] = [];

  // 47 expenses spread over ~60 days, deterministic.
  for (let i = 0; i < 47; i++) {
    const t = EXPENSES[(i * 7) % EXPENSES.length];
    rows.push({ date: day(1 + ((i * 5) % 58)), type: t.type, amount: t.amount, description: t.desc, cat: t.cat });
  }
  // 3 income rows.
  rows.push({ date: day(30), type: "income", amount: 18_000_000, description: "Lương tháng", cat: "income" });
  rows.push({ date: day(2), type: "income", amount: 18_000_000, description: "Lương tháng", cat: "income" });
  rows.push({ date: day(15), type: "income", amount: 2_500_000, description: "Freelance thiết kế", cat: "income" });
  return rows;
}

async function main() {
  const categories = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
    categories.set(c.slug, row.id);
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash, isDemo: true },
    create: { email: DEMO_EMAIL, name: "Tài khoản demo", passwordHash, isDemo: true, consentAt: new Date() },
  });

  const rows = buildDemoRows();
  const hashes = buildDedupHashes(rows);
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  const res = await prisma.transaction.createMany({
    data: rows.map((r, i) => ({
      userId: user.id,
      date: r.date,
      type: r.type,
      amount: r.amount,
      description: r.description,
      categoryId: categories.get(r.cat),
      dedupHash: hashes[i],
    })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${categories.size} categories, demo user ${DEMO_EMAIL}, ${res.count} transactions.`);
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
