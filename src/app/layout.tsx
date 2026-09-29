import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BERINAG TILES — Premium Architectural Digital Showroom",
  description:
    "Explore curated tile designs, marble slabs, wooden planks and building materials before visiting our physical showroom in Berinag, Uttarakhand.",
  openGraph: {
    title: "BERINAG TILES — Premium Architectural Digital Showroom",
    description:
      "Find a design you love. See it online. Feel it in our showroom in Berinag, Uttarakhand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-white">
        <ToastProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
