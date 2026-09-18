import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizVerify - Verified Digital Trust",
  description: "Verify your business domain and build digital trust with BizVerify.",
  authors: [{ name: "BizVerify" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "BizVerify",
    description: "Verify your business domain and build digital trust.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}