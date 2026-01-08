import type { Metadata } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

export const metadata: Metadata = {
  title: "VELOCITY BET | Live Sports Betting",
  description: "Real-time sports betting platform with live odds, instant payouts, and competitive lines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
