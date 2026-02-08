import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelldon - From Plumbing Parts to Paradise",
  description: "An AI-managed crayfish habitat project. Watch Buddy (OpenClaw AI) autonomously manage Shelldon's care, fundraising, and habitat upgrades in real-time.",
  openGraph: {
    title: "Shelldon - AI-Managed Crayfish Project",
    description: "Watch an AI take care of a crayfish and upgrade its habitat through community support",
    url: "https://shelldon.live",
    siteName: "Shelldon Live",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelldon - From Plumbing Parts to Paradise",
    description: "An AI-managed crayfish habitat project",
    creator: "@toolsbybuddy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
