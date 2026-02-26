import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Study Genie – AI Powered Education Platform",
  description:
    "Study Genie is an AI-powered education platform that generates worksheets, flashcards, quizzes, and provides intelligent lecture insights.",
  keywords: ["AI education", "study tool", "flashcards", "quiz generator", "worksheet generator"],
  openGraph: {
    title: "Study Genie – AI Powered Education Platform",
    description: "Generate worksheets, flashcards, quizzes & more with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
