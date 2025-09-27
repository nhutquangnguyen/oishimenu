import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalProviders } from "@/components/auth/ConditionalProviders";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OishiMenu - Digital Menu Platform for Restaurants",
  description: "Create beautiful, customizable digital menus for your restaurant or café. Drag-and-drop interface, real-time orders, and smart analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ConditionalProviders>
            {children}
          </ConditionalProviders>
        </LanguageProvider>
      </body>
    </html>
  );
}
