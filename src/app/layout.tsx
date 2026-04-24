import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { Toaster } from "@/components/ui/toaster";
import { CommandPalette } from "@/components/layout/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secret Note",
  description: "Serverless Ecosystem Manager",
};

import { SecurityWrapper } from "@/components/security/SecurityWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <WorkspaceProvider>
          <SecurityWrapper>
            {children}
            <CommandPalette />
          </SecurityWrapper>
          <Toaster />
        </WorkspaceProvider>
      </body>
    </html>
  );
}
