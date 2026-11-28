import type { Metadata } from "next";
import { MockMomoWorkspace } from "@/components/risk/MockMomoWorkspace";

export const metadata: Metadata = {
  title: "Mô phỏng MoMo",
};

export default function MockMomoPage() {
  return <MockMomoWorkspace />;
}
