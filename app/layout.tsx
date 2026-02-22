import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Aurora from "@/components/reactbits/Aurora";
import FloatingBtn from "@/components/FloatingBtn";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="ko" className="dark">
        <body
          className={`${pretendard.variable} antialiased font-sans relative`}
        >
          <Header />
          <div className="fixed inset-0 -z-1">
            <Aurora
              colorStops={["#00aeff", "#0011ff", "#6929ff"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>

          {children}

          <Footer />

          <FloatingBtn />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://imqa.io"),

  title: {
    default: "IMQA",
    template: "%s | IMQA",
  },

  description:
    "IMQA는 프론트엔드 전 영역의 성능을 실시간 모니터링하고 코드 레벨로 분석합니다. 웹부터 모바일까지, 사용자가 보는 모든 화면에서 최적의 디지털 경험을 제공해 보세요.",

  // keywords는 최근 SEO 영향이 거의 없지만 “필요하다”면 유지 가능
  keywords: [
    "IMQA",
    "프론트엔드 성능",
    "성능 모니터링",
    "RUM",
    "모바일 성능",
    "웹 성능",
    "사용자 경험 분석",
  ],

  openGraph: {
    type: "website",
    siteName: "IMQA",
    title: "프론트엔드 성능 모니터링 솔루션 IMQA",
    description:
      "IMQA는 프론트엔드 전 영역의 성능을 실시간 모니터링하고 코드 레벨로 분석합니다. 웹부터 모바일까지, 사용자가 보는 모든 화면에서 최적의 디지털 경험을 제공해 보세요.",
    url: "https://imqa.io/",
    images: [
      {
        url: "https://imqa.io/theme/responsive_onycom/include/img/sns_logo.png",
        width: 199,
        height: 104,
        alt: "IMQA",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "프론트엔드 성능 모니터링 솔루션 IMQA",
    description:
      "IMQA는 프론트엔드 전 영역의 성능을 실시간 모니터링하고 코드 레벨로 분석합니다. 웹부터 모바일까지, 사용자가 보는 모든 화면에서 최적의 디지털 경험을 제공해 보세요.",
    images: [
      "https://imqa.io/theme/responsive_onycom/include/img/sns_logo.png",
    ],
  },

  // 소유권/도메인 검증: 전역에 1번만
  verification: {
    other: {
      "naver-site-verification": ["125248830823a317788ca7a33540c3aebeae6761"],
      "facebook-domain-verification": ["dq3ydx9kejlrg2g6a8npg8cbl2mpbi"],
    },
  },

  alternates: {
    canonical: "https://imqa.io/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
