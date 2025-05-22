import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a base, Geist provided by user but not in default Next.js
import { Geist_Sans as GeistSans, Geist_Mono as GeistMono } from 'geist/font';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MiniC Compiler',
  description: 'Compile MiniC to JavaScript and understand the process.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
