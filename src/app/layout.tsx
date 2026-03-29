import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scorr — AP Physics AI Tutor | Score a 5",
  description:
    "The only AI tutor that grades your FRQs against the real AP rubric, tracks your weak topics, and predicts your exam score — updated after every practice session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
