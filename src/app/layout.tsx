import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/i18n/language-provider";
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
  title: "ZD Translate — Real-Time AI Desktop Translator",
  description:
    "Instant, context-aware screen, voice, and text translation for desktop. Break language barriers seamlessly without switching windows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
