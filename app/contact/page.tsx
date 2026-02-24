"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitStatus("success");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitStatus("idle"), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          {/* Field styles: only bottom border */}
          {[
            { id: "name", label: "Name", type: "text", placeholder: "Your name" },
            { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
          ].map((field) => (
            <div key={field.id} className="relative">
              <label
                htmlFor={field.id}
                className="block text-xs tracking-[0.2em] uppercase mb-3 opacity-50"
                style={{ color: "var(--text)" }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                required
                placeholder={field.placeholder}
                className="w-full bg-transparent text-base pb-3 outline-none placeholder:opacity-30 transition-colors duration-200"
                style={{
                  color: "var(--text)",
                  borderBottom: "1px solid var(--border)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor = "var(--accent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor = "var(--border)";
                }}
              />
            </div>
          ))}

          <div className="relative">
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
              className="w-full bg-transparent text-base pb-3 outline-none resize-none placeholder:opacity-30 transition-colors duration-200"
              style={{
                color: "var(--text)",
                borderBottom: "1px solid var(--border)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = "var(--accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = "var(--border)";
              }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", damping: 20 }}
            className="inline-flex items-center gap-3 text-sm tracking-widest uppercase disabled:opacity-40"
            style={{ color: "var(--accent)" }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="inline-block w-4 h-4 rounded-full border-t animate-spin"
                  style={{ borderColor: "var(--accent)" }}
                />
                Sending…
              </>
            ) : (
              <>
                Send Message
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
              </>
            )}
          </motion.button>

          {submitStatus === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm tracking-wide"
              style={{ color: "var(--accent)" }}
            >
              Thank you — message received.
            </motion.p>
          )}
        </motion.form>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-12 space-y-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[
            { label: "Email", value: "elijah@gallery.com" },
            { label: "Phone", value: "+1 (555) 123-4567" },
            { label: "Location", value: "New York, NY" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-6 items-baseline">
              <span
                className="text-xs tracking-[0.2em] uppercase opacity-40 w-20 shrink-0"
                style={{ color: "var(--text)" }}
              >
                {label}
              </span>
              <span
                className="text-sm opacity-70"
                style={{ color: "var(--text)" }}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Social links */}
          <div className="pt-6 flex gap-8">
            {["Instagram", "Facebook", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs tracking-widest uppercase gold-underline opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text)" }}
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
