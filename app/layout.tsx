import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitRoast Arena — Evidence-Based GitHub Portfolio Analyzer",
  description: "Deterministic portfolio readiness scoring, evidence-backed character roasts, and actionable rescue plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
    </html>
  );
}
