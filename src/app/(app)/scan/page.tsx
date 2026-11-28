import type { Metadata } from "next";
import { ScannerWorkspace } from "@/components/risk/ScannerWorkspace";

export const metadata: Metadata = {
  title: "Quét lừa đảo",
};

export default function ScanPage() {
  return <ScannerWorkspace />;
}
