import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import Toast from "@/app/_components/Toast";

const exo = localFont({
  src: "../../public/fonts/exo.woff2",
  variable: "--font-exo",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshCart - E-Commerce",
  description: "FreshCart Route Academy e-commerce project",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={exo.variable}>
        <AppProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toast />
        </AppProviders>
      </body>
    </html>
  );
}
