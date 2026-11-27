import type { ReactNode } from "react";
import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    // Force a light palette: the root stylesheet switches body colors in dark mode.
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
