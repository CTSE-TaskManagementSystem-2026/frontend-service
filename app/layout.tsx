import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskMaster",
  description: "A modern workspace for projects, tasks, and team coordination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}