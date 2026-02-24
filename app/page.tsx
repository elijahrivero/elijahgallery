"use client";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

type Album = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt: string;
};

/* ── Stagger helpers ──────────────────────────────────────── */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/albums", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAlbums(d.albums || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center"
        style={{ height: "100svh", minHeight: 600 }}
      >
        {/* Radial gold glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,169,110,0.07), transparent)",
          }}
        />

        <div className="relative z-10 text-center px-6 select-none">
          {/* ELIJAH — clip-path reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="leading-none tracking-[0.12em] uppercase"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(4rem, 12vw, 10rem)",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Elijah
            </motion.h1>
          </div>

          {/* GALLERY — staggered 0.15s after */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="leading-none tracking-[0.28em] uppercase -mt-3"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.5rem, 5vw, 4rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--accent)",
              }}
            >
              Gallery
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 tracking-[0.25em] uppercase text-xs sm:text-sm opacity-50"
            style={{ color: "var(--text)", letterSpacing: "0.25em" }}
          >
            Capturing the world through light
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12"
          >
            <Link
              href="#gallery"
              className="inline-flex items-center gap-3 px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--accent)";
                (e.currentTarget as HTMLElement).style.color = "#080808";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--accent)";
              }}
            >
              View Work
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div
            className="animate-scroll-pulse"
            style={{
              width: 1,
              height: 48,
              background:
                "linear-gradient(to bottom, var(--accent), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* ── Albums Section ────────────────────────────────────── */}
      <section id="gallery" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4 opacity-50"
              style={{ color: "var(--accent)" }}
            >
              Portfolio
            </p>
            <div className="flex items-end gap-6">
              <h2
                className="text-4xl sm:text-5xl leading-tight"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text)",
                }}
              >
                Selected Works
              </h2>
              {/* Gold rule */}
              <div
                className="flex-1 mb-3"
                style={{ height: 1, background: "var(--accent)", opacity: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{
                    background: "var(--surface)",
                    aspectRatio: i === 1 ? "16/9" : "4/3",
                    gridColumn: i === 1 ? "span 2" : "span 1",
                  }}
                />
              ))}
            </div>
          )}

          {/* Albums grid */}
          {!isLoading && albums.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: "var(--border)" }}
            >
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  variants={item}
                  whileHover={{ scale: 1.015 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={index === 0 ? "md:col-span-2" : ""}
                  style={{ background: "var(--bg)" }}
                >
                  <Link href={`/album/${album.id}`} className="block group">
                    {/* Image area */}
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: index === 0 ? "16/9" : "4/3" }}
                    >
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-75 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "var(--surface)" }}
                        >
                          <svg
                            className="w-16 h-16 opacity-20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Image count badge */}
                      <div
                        className="absolute top-4 right-4 text-xs tracking-widest font-mono px-2 py-1"
                        style={{
                          background: "rgba(0,0,0,0.6)",
                          color: "rgba(255,255,255,0.7)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {album.imageCount}
                      </div>

                      {/* Album name overlay — slides up on hover */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-6">
                        <p
                          className="text-sm tracking-[0.2em] uppercase"
                          style={{ color: "var(--accent)" }}
                        >
                          {album.name}
                        </p>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div
                      className="px-5 py-4 flex items-center justify-between"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <span
                        className="text-sm tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        {album.name}
                      </span>
                      <span
                        className="text-xs opacity-50"
                        style={{ color: "var(--text)" }}
                      >
                        {album.imageCount}{" "}
                        {album.imageCount === 1 ? "photo" : "photos"}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && albums.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <p
                className="text-5xl mb-6 opacity-20"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text)",
                }}
              >
                —
              </p>
              <p
                className="tracking-[0.2em] uppercase text-sm opacity-40"
                style={{ color: "var(--text)" }}
              >
                No albums yet
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
