import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "TrustPay AI — Kiểm tra trước khi tin, cân nhắc trước khi chuyển tiền.",
    template: "%s | TrustPay AI",
  },
  description:
    "Lá chắn tài chính AI cá nhân: phát hiện lừa đảo qua tin nhắn, đường dẫn và kiểm tra an toàn trước khi chuyển tiền.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${geistMono.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
