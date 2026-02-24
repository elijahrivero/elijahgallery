"use client";
import { motion } from "framer-motion";

const stats = [
  { number: "8+", label: "Years of Experience" },
  { number: "50+", label: "Awards & Recognition" },
  { number: "200+", label: "Satisfied Clients" },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Opening Quote ─────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="overflow-hidden mb-4">
            <motion.p
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                color: "var(--text)",
              }}
            >
              &ldquo;Light is the language I speak.&rdquo;
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="mx-auto mt-8"
            style={{
              height: 1,
              width: 64,
              background: "var(--accent)",
              transformOrigin: "left",
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 tracking-[0.25em] uppercase text-xs opacity-40"
            style={{ color: "var(--accent)" }}
          >
            Elijah Rivero &mdash; Photographer
          </motion.p>
        </div>
      </section>

      {/* ── Bio + Image (two-column) ───────────────────────────── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: bio */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6 opacity-50"
              style={{ color: "var(--accent)" }}
            >
              About
            </p>
            <h2
              className="text-3xl sm:text-4xl mb-8 leading-snug"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "var(--text)",
              }}
            >
              Elijah Rivero
            </h2>

            <div
              className="space-y-6 text-base leading-relaxed opacity-70"
              style={{ color: "var(--text)" }}
            >
              <p>
                I&apos;m a passionate photographer with over 8 years of
                experience capturing life&apos;s most precious moments. My
                journey began with a simple point-and-shoot camera and has
                evolved into a deep love for the art of visual storytelling.
              </p>
              <p>
                Specializing in portrait, landscape, and event photography, I
                believe that every moment has a story worth telling. My approach
                combines technical expertise with an intuitive understanding of
                light, composition, and human emotion.
              </p>
              <p>
                When I&apos;m not behind the camera, you&apos;ll find me
                exploring new locations, studying the masters of photography,
                and constantly pushing the boundaries of what&apos;s possible
                with light and shadow.
              </p>
            </div>

            <motion.a
              href="/contact"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", damping: 20 }}
              className="inline-flex items-center gap-3 mt-10 text-sm tracking-widest uppercase gold-underline"
              style={{ color: "var(--accent)" }}
            >
              Work with me
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
            </motion.a>
          </motion.div>

          {/* Right: profile image, full-bleed tall */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
            style={{ aspectRatio: "3/4", maxHeight: 680 }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1067&fit=crop&crop=face"
              alt="Elijah Rivero"
              className="w-full h-full object-cover"
            />
            {/* Subtle gold border accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ border: "1px solid rgba(201,169,110,0.15)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-0"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: "easeOut" },
                  },
                }}
                className="text-center py-10 sm:py-0 sm:px-8"
                style={{
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <p
                  className="text-6xl font-bold leading-none mb-3"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "var(--accent)",
                  }}
                >
                  {stat.number}
                </p>
                <p
                  className="text-xs tracking-[0.2em] uppercase opacity-50"
                  style={{ color: "var(--text)" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
