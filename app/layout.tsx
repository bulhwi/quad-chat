import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quad Talk - 4인 실시간 채팅",
  description: "최대 4명까지 참여 가능한 실시간 채팅 애플리케이션",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#3B82F6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quad Talk"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
