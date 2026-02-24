"use client";
import Link from "next/link";
import { useCallback, useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { downloadImage } from "@/lib/download";

type AlbumPageProps = {
  params: Promise<{ albumId: string }>;
};

type GalleryImage = {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
};

export default function AlbumPage({ params }: AlbumPageProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const resolvedParams = use(params);
  const albumName = resolvedParams.albumId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/albums/${resolvedParams.albumId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.albumId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const deleteImage = useCallback(
    async (imageId: string) => {
      if (
        !confirm(
          "Are you sure you want to delete this image? This action cannot be undone."
        )
      )
        return;

      setIsDeleting(imageId);
      try {
        const response = await fetch("/api/images/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: imageId }),
        });
        const result = await response.json();
        if (response.ok) {
          setToastMessage("Image deleted.");
          setTimeout(() => setToastMessage(""), 3000);
          await loadImages();
        } else {
          setToastMessage(`Failed: ${result.error}`);
          setTimeout(() => setToastMessage(""), 5000);
        }
      } catch {
        setToastMessage("Error deleting image.");
        setTimeout(() => setToastMessage(""), 5000);
      } finally {
        setIsDeleting(null);
      }
    },
    [loadImages]
  );

  const handleDownload = useCallback(
    async (imageUrl: string, imageId: string) => {
      setIsDownloading(imageId);
      try {
        const success = await downloadImage(imageUrl);
        setToastMessage(success ? "Downloaded." : "Download failed.");
        setTimeout(() => setToastMessage(""), 3000);
      } catch {
        setToastMessage("Error downloading.");
        setTimeout(() => setToastMessage(""), 5000);
      } finally {
        setIsDownloading(null);
      }
    },
    []
  );

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    setIsLightboxOpen(false);
  };

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImageIndex === null) return;
      if (direction === "prev") {
        setSelectedImageIndex(
          selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1
        );
      } else {
        setSelectedImageIndex(
          selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0
        );
      }
    },
    [selectedImageIndex, images.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, navigateLightbox]);

  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isLightboxOpen]);

  /* ── Loading state ──────────────────────────────────────── */
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="text-center">
          <div
            className="w-1 h-12 mx-auto mb-8 animate-scroll-pulse"
            style={{
              background: "linear-gradient(to bottom, var(--accent), transparent)",
            }}
          />
          <p
            className="text-xs tracking-[0.3em] uppercase opacity-40"
            style={{ color: "var(--text)" }}
          >
            Loading…
          </p>
        </div>
      </div>
    );
  }

  /* ── Main ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-20 right-6 z-50 px-5 py-3 text-sm tracking-wide"
            style={{
              background: "var(--elevated)",
              color: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isLightboxOpen && selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(4,4,4,0.97)" }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-6 z-50 text-2xl leading-none opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: "#fff" }}
              aria-label="Close"
            >
              ×
            </button>

            {/* Caption bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-center">
              <p
                className="text-xs tracking-[0.25em] uppercase opacity-50"
                style={{ color: "#fff" }}
              >
                {albumName} &nbsp;·&nbsp; {selectedImageIndex + 1} /{" "}
                {images.length}
              </p>
            </div>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
                  className="absolute left-4 z-50 p-4 opacity-30 hover:opacity-80 transition-opacity"
                  style={{ color: "#fff" }}
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
                  className="absolute right-4 z-50 p-4 opacity-30 hover:opacity-80 transition-opacity"
                  style={{ color: "#fff" }}
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image — layoutId for shared-element */}
            <motion.div
              key={selectedImageIndex}
              layoutId={`img-${images[selectedImageIndex].id}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative max-w-[90vw] max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].id}
                className="max-w-full max-h-[88vh] w-auto h-auto object-contain"
              />
            </motion.div>

            {/* Download & Delete */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 flex gap-4"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(
                    images[selectedImageIndex].url,
                    images[selectedImageIndex].id
                  );
                }}
                disabled={isDownloading === images[selectedImageIndex].id}
                className="text-xs tracking-widest uppercase px-4 py-2 transition-opacity disabled:opacity-40"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {isDownloading === images[selectedImageIndex].id
                  ? "Downloading…"
                  : "Download"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteImage(images[selectedImageIndex].id);
                  closeLightbox();
                }}
                disabled={isDeleting === images[selectedImageIndex].id}
                className="text-xs tracking-widest uppercase px-4 py-2 transition-opacity disabled:opacity-40"
                style={{
                  border: "1px solid rgba(255,80,80,0.3)",
                  color: "rgba(255,100,100,0.7)",
                }}
              >
                {isDeleting === images[selectedImageIndex].id
                  ? "Deleting…"
                  : "Delete"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Album Hero ────────────────────────────────────────── */}
      <section className="pt-24 pb-12 px-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-10 opacity-40 hover:opacity-80 transition-opacity gold-underline"
          style={{ color: "var(--accent)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl mb-4"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "var(--text)",
          }}
        >
          {albumName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xs tracking-[0.3em] uppercase opacity-40"
          style={{ color: "var(--text)" }}
        >
          {images.length} {images.length === 1 ? "image" : "images"}
        </motion.p>
      </section>

      {/* ── Masonry Grid ─────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 pb-24">
        {images.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]"
          >
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: "easeOut" },
                  },
                }}
                className="mb-4 break-inside-avoid relative group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <motion.div
                  layoutId={`img-${img.id}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="relative overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={img.id}
                    className="w-full transition-opacity duration-300 opacity-85 group-hover:opacity-100"
                    loading="lazy"
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-32">
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
              className="text-xs tracking-[0.3em] uppercase opacity-40"
              style={{ color: "var(--text)" }}
            >
              Album is empty
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
