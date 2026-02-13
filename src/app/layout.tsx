import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valentine's Clue Hunt",
  description: "Find the clues, collect the letters.",
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
