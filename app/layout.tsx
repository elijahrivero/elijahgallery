import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import CubeCursor from "@/components/cube-cursor";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elijah Gallery",
    template: "%s • Elijah Gallery",
  },
  description:
    "A modern photography gallery showcasing beautiful moments and artistic vision. Professional photographer specializing in portraits, landscapes, street photography, and events.",
  keywords: [
    "photography",
    "portfolio",
    "photographer",
    "portraits",
    "landscapes",
    "street photography",
    "events",
    "professional photographer",
  ],
  authors: [{ name: "Elijah Rivero" }],
  creator: "Elijah Rivero",
  publisher: "Elijah Gallery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase:
    typeof window === "undefined" && process.env.NEXT_PUBLIC_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
      : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Elijah Gallery",
    description:
      "A modern photography gallery showcasing beautiful moments and artistic vision",
    siteName: "Elijah Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elijah Gallery",
    description:
      "A modern photography gallery showcasing beautiful moments and artistic vision",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={playfair.variable}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var shouldBeDark = savedTheme !== 'light';
                  var root = document.documentElement;
                  if (shouldBeDark) {
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen md:[&_*]:cursor-none"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <CubeCursor />
            <SiteHeader />
            <main className="flex-1 pt-16">{children}</main>
            <footer
              style={{
                borderTop: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-xs tracking-widest uppercase opacity-40">
                <span>© {new Date().getFullYear()} Elijah Gallery</span>
                <span
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <span>Photography &amp; Vision</span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
