import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Aurora from "@/components/Aurora";
import DarkVeil from "@/components/DarkVeil";

const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IMQA",
  description: "프론트엔드 성능 모니터링 솔루션, IMQA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${pretendard.variable} antialiased font-sans relative`}>
        <Header />
        <div className="fixed inset-0 z-0">
          <Aurora
            colorStops={["#66fffc", "#0011ff", "#6929ff"]}
            blend={0.5}
            amplitude={1.0}
            speed={1}
          />
        </div>

        {children}
      </body>
    </html>
  );
}
