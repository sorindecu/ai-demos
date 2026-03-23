import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vectis Demo — AI Business Automation",
  description: "AI-powered automation demos for senior living and accounting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Nav */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-semibold text-gray-900">Vectis Consulting</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">Demo Preview</span>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
              April 24, 2026 Client Demo
            </span>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
