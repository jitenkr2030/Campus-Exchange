import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Exchange - Your Campus Marketplace",
  description: "Buy, sell, and trade everything on campus. Notes, books, bikes, food tokens, and rooms - all in one trusted place.",
  keywords: ["campus", "marketplace", "exchange", "students", "notes", "books", "bikes", "food tokens", "rooms"],
  authors: [{ name: "Campus Exchange Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Campus Exchange - Your Campus Marketplace",
    description: "Buy, sell, and trade everything on campus. Notes, books, bikes, food tokens, and rooms - all in one trusted place.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Exchange - Your Campus Marketplace",
    description: "Buy, sell, and trade everything on campus.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
