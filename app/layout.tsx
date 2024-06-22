import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import RootProviders from '@/components/providers/RootProviders';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'Budget Tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' className='dark' style={{ colorScheme: 'dark' }}>
        <body className={inter.className}>
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}