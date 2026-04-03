import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Ismath's Nutrition Plan",
  description: 'Daily athlete nutrition planner',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-teal-700 text-white px-4 py-3 flex gap-6">
          <a href="/" className="font-semibold hover:opacity-80">🏠 Plan</a>
          <a href="/schedule" className="hover:opacity-80">📅 Schedule</a>
          <a href="/history" className="hover:opacity-80">📋 History</a>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
