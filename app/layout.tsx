import type { Metadata } from "next";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteVisitTracker from "@/components/SiteVisitTracker";
import CustomFonts from "@/components/CustomFonts";

export const metadata: Metadata = {
  title: "Кристина Маркина",
  description:
    "Современная художественная галерея",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <SiteVisitTracker />

        <CustomFonts />

        <Header />

        <main className="min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}