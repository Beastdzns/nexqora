import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

import { Providers } from "../app/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CirclePay ⛽️",
  description: "Gasless USDC transfers powered by EIP-3009",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
