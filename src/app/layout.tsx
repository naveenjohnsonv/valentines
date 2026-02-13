import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valentine's NFC Tag Hunt",
  description: "Hunt the tags, collect the letters, and discover the surprise.",
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
