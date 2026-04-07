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
  title: "Social Media Views Dashboard",
  description: "Analyze and compare views from TikTok, YouTube, and Instagram in one place. Real-time social media analytics dashboard.",
  keywords: ["social media", "analytics", "tiktok", "youtube", "instagram", "views", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050510] text-white">
        {/* Background Orbs */}
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
        <div className="bg-orb-3" />
        
        {/* Grid Pattern Overlay */}
        <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />
        
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
