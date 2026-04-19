import type { Metadata } from "next";
import "./globals.css";
import ThemeInitializer from "@/app/components/ThemeInitializer";

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
      <body>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
