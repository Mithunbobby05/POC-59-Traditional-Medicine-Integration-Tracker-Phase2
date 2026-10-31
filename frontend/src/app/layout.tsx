import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traditional & Complementary Medicine Integration Tracker",
  description: "Infocreon Internship - Traditional & Complementary Medicine Integration Tracker. Synthetic demonstration data for POC-59.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
