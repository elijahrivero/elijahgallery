"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Album = {
  id: string;
  name: string;
  coverImage?: string;
};

type GalleryCubeProps = {
  albums: Album[];
  size?: number; // px
};

export default function GalleryCube({ albums, size = 220 }: GalleryCubeProps) {
  const router = useRouter();
  const [zooming, setZooming] = useState<{ index: number; href: string } | null>(null);
  // Choose up to 6 covers for cube faces
  const faces = useMemo(() => {
    const picks = albums.slice(0, 6);
    // pad with undefined to keep six faces
    while (picks.length < 6) picks.push(undefined as any);
    return picks;
  }, [albums]);

  const half = size / 2;
  const focusRotation = useMemo(() => {
    if (!zooming) return { rotateX: -10, rotateY: 0, scale: 1 };
    const i = zooming.index;
    const mapping: Record<number, { rx: number; ry: number }> = {
      0: { rx: 0, ry: 0 },
      1: { rx: 0, ry: -90 },
      2: { rx: 0, ry: -180 },
      3: { rx: 0, ry: 90 },
      4: { rx: -90, ry: 0 },
      5: { rx: 90, ry: 0 },
    };
    const { rx, ry } = mapping[i] ?? { rx: 0, ry: 0 };
    return { rotateX: rx, rotateY: ry, scale: 1.6 };
  }, [zooming]);

  return (
    <div className="relative perspective-[1200px] select-none">
      <motion.div
        className="relative mx-auto"
        style={{ width: size, height: size }}
        initial={{ rotateX: -10, rotateY: 25 }}
        animate={{ rotateX: -10, rotateY: 25 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating animation */}
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Rotating cube (idle) or focus + zoom (on click) */}
          {!zooming ? (
            <motion.div
              className="relative w-full h-full transform-style-3d"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
            {/* 6 faces */}
            {[
              { transform: `rotateY(0deg) translateZ(${half}px)` },
              { transform: `rotateY(90deg) translateZ(${half}px)` },
              { transform: `rotateY(180deg) translateZ(${half}px)` },
              { transform: `rotateY(-90deg) translateZ(${half}px)` },
              { transform: `rotateX(90deg) translateZ(${half}px)` },
              { transform: `rotateX(-90deg) translateZ(${half}px)` },
            ].map((style, i) => {
              const album = faces[i];
              const href = album ? `/album/${album.id}` : undefined;
              const content = (
                <div
                  className="absolute inset-0 overflow-hidden rounded-xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[1px]"
                  style={{ transform: style.transform, background: "#0f172a" }}
                >
                  {album?.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-300/70 text-sm">
                      No Cover
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs px-2 py-1">
                    {album?.name ?? "Album"}
                  </div>
                </div>
              );

              return href ? (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setZooming({ index: i, href });
                    // navigate after animation completes
                    setTimeout(() => router.push(href), 650);
                  }}
                  aria-label={`Open ${album.name}`}
                  className="absolute inset-0 block transform-style-3d focus:outline-none"
                  style={{ transform: style.transform }}
                >
                  {content}
                </button>
              ) : (
                <div key={i} className="absolute inset-0 transform-style-3d" style={{ transform: style.transform }}>
                  {content}
                </div>
              );
            })}
            </motion.div>
          ) : (
            // Focus the clicked face to the front and zoom
            <motion.div
              className="relative w-full h-full transform-style-3d"
              initial={{ scale: 1, rotateX: -10, rotateY: 0 }}
              animate={focusRotation}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {[
                { transform: `rotateY(0deg) translateZ(${half}px)` },
                { transform: `rotateY(90deg) translateZ(${half}px)` },
                { transform: `rotateY(180deg) translateZ(${half}px)` },
                { transform: `rotateY(-90deg) translateZ(${half}px)` },
                { transform: `rotateX(90deg) translateZ(${half}px)` },
                { transform: `rotateX(-90deg) translateZ(${half}px)` },
              ].map((style, i) => {
                const album = faces[i];
                return (
                  <div key={i} className="absolute inset-0 transform-style-3d" style={{ transform: style.transform }}>
                    <div
                      className="absolute inset-0 overflow-hidden rounded-xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[1px]"
                      style={{ background: "#0f172a" }}
                    >
                      {album?.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-slate-300/70 text-sm">No Cover</div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs px-2 py-1">
                        {album?.name ?? "Album"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Shadow under cube */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[60%] h-6 rounded-full bg-black/40 blur-xl opacity-40" />
        </motion.div>
      </motion.div>
    </div>
  );
}


