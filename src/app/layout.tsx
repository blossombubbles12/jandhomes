import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'maplibre-gl/dist/maplibre-gl.css';
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jand Homes Properties | Modern Luxury in Lagos",
  description: "Defining modern luxury in Lagos real estate. We curate the finest properties with transparency, excellence, and visionary design.",
  keywords: ["Lagos Real Estate", "Luxury Homes Lagos", "Jand Homes", "Property Management Nigeria", "Luxury Apartments Ikoyi", "Lekki Homes"],
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
