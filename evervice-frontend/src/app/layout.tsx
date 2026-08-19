import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServEase | Premium Event & Wedding Marketplace",
  description: "Discover and book premium services for weddings, corporate gatherings, and boutique celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F1]">{children}</body>
    </html>
  );
}
