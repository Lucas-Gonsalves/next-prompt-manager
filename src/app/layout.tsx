import "@/styles/globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Manager",
  description: "Manage your prompts",
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} text-ace bg-gray-900 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
