import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WorkspaceProvider } from "@/client/context/WorkspaceContext";
import { Toaster } from "@/client/components/ui/Toaster";
import { CommandPalette } from "@/client/components/layout/CommandPalette";
import { SecurityWrapper } from "@/client/components/security/SecurityWrapper";
import { APP_CONFIG } from "@/shared/constants/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: "Serverless Ecosystem Manager",
};


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
