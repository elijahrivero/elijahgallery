"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8,8,8,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link
          id="site-logo"
          href="/"
          className="text-xl tracking-widest uppercase transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "var(--accent)",
            fontWeight: 700,
          }}
        >
          Elijah
        </Link>
        <nav className="flex items-center gap-8 text-sm font-medium tracking-wide">
          {[
            { href: "/", label: "Gallery" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="gold-underline opacity-70 hover:opacity-100 transition-opacity duration-200"
              style={{ color: "var(--text)" }}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
