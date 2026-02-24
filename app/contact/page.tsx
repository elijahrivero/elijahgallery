"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const inputBase =
  "w-full bg-transparent text-base pb-3 outline-none resize-none transition-colors duration-200";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Gold border on focus via CSS class swap instead of direct style mutation
  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      e.currentTarget.classList.add("field-focused"),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      e.currentTarget.classList.remove("field-focused"),
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-32">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-6 opacity-50"
            style={{ color: "var(--accent)" }}
          >
            Contact
          </p>
          <h1
            className="text-5xl sm:text-6xl leading-tight"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text)",
            }}
          >
            Let&apos;s talk.
          </h1>
        </motion.div>

        {/* Form — plain <form>, not motion.form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs tracking-[0.2em] uppercase mb-3 opacity-50"
                style={{ color: "var(--text)" }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className={inputBase}
                style={{ color: "var(--text)" }}
                {...focusProps}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs tracking-[0.2em] uppercase mb-3 opacity-50"
                style={{ color: "var(--text)" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={inputBase}
                style={{ color: "var(--text)" }}
                {...focusProps}
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs tracking-[0.2em] uppercase mb-3 opacity-50"
                style={{ color: "var(--text)" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project..."
                className={inputBase}
                style={{ color: "var(--text)" }}
                {...focusProps}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { x: 4 } : {}}
              transition={{ type: "spring", damping: 20 }}
              className="inline-flex items-center gap-3 text-sm tracking-widest uppercase disabled:opacity-40"
              style={{ color: "var(--accent)" }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full animate-spin"
                    style={{
                      border: "1px solid var(--accent)",
                      borderTopColor: "transparent",
                    }}
                  />
                  Sending…
                </>
              ) : (
                <>
                  Send Message
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </motion.button>

            {/* Success message */}
            <AnimatePresence>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm tracking-wide"
                  style={{ color: "var(--accent)" }}
                >
                  Thank you — message received.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-12 space-y-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[
            { label: "Email",    value: "elijah@gallery.com"  },
            { label: "Phone",    value: "+1 (555) 123-4567"   },
            { label: "Location", value: "New York, NY"        },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-6 items-baseline">
              <span
                className="text-xs tracking-[0.2em] uppercase opacity-40 w-20 shrink-0"
                style={{ color: "var(--text)" }}
              >
                {label}
              </span>
              <span className="text-sm opacity-70" style={{ color: "var(--text)" }}>
                {value}
              </span>
            </div>
          ))}

          <div className="pt-6 flex gap-8">
            {["Instagram", "Facebook", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs tracking-widest uppercase gold-underline opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text)" }}
              >
                {s}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Field focus styles injected globally */}
      <style>{`
        .field-focused {
          border-bottom-color: var(--accent) !important;
        }
        input, textarea {
          border-bottom: 1px solid var(--border);
          color-scheme: light dark;
        }
        input::placeholder, textarea::placeholder {
          opacity: 0.35;
        }
      `}</style>
    </div>
  );
}
