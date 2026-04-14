import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTO Intelligence Flywheel",
  description: "AI-powered intelligence for Capgemini's senior leadership",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
