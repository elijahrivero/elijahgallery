import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "@/lib/theme-context";
import CubeCursor from "@/components/cube-cursor";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "Elijah Gallery",
    template: "%s • Elijah Gallery",
  },
  description: "A modern photography gallery showcasing beautiful moments and artistic vision. Professional photographer specializing in portraits, landscapes, street photography, and events.",
  keywords: ["photography", "portfolio", "photographer", "portraits", "landscapes", "street photography", "events", "professional photographer"],
  authors: [{ name: "Elijah Rivero" }],
  creator: "Elijah Rivero",
  publisher: "Elijah Gallery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: typeof window === "undefined" && process.env.NEXT_PUBLIC_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
    : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Elijah Gallery",
    description: "A modern photography gallery showcasing beautiful moments and artistic vision",
    siteName: "Elijah Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elijah Gallery",
    description: "A modern photography gallery showcasing beautiful moments and artistic vision",
    creator: "@photographer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

                  const root = document.documentElement;
                  if (shouldBeDark) {
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                  }
                } catch (e) {
                  // Fallback to light mode if localStorage is not available
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 md:[&_*]:cursor-none">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <CubeCursor />
            <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
              <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                <Link id="site-logo" href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  Elijah Gallery
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium">
                  <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Gallery
                  </Link>
                  <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Contact
                  </Link>
                  <Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Admin
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    © {new Date().getFullYear()} Elijah Gallery. Built with Next.js & Tailwind CSS.
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Capturing moments, creating memories
                    </span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
