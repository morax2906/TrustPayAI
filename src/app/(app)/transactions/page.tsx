import type { Metadata } from "next";
import { TransactionsWorkspace } from "@/components/transactions/TransactionsWorkspace";

export const metadata: Metadata = {
  title: "Giao dịch",
};

export default function TransactionsPage() {
  return <TransactionsWorkspace />;
}
