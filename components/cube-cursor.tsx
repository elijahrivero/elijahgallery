"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";

export default function CubeCursor() {
  const { theme } = useTheme();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  // Track mouse position
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove as any);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  // Detect hovering over interactive elements
  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a, button, [role='button'], input, select, textarea, label"));
    };
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => window.removeEventListener("mouseover", onOver as any);
  }, []);

  // Click feedback
  useEffect(() => {
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // rAF loop — dot snaps, ring eases
  useEffect(() => {
    let raf: number;
    const ease = 0.11;
    const step = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top = `${mouse.current.y}px`;
      }
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * ease;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isDark = theme === "dark";
  const dotColor = isDark ? "rgba(255,255,255,0.95)" : "rgba(15,23,42,0.9)";
  const ringBorder = isDark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.45)";
  const ringBg = hovering
    ? isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"
    : "transparent";

  const dotSize = clicking ? 3 : hovering ? 6 : 5;
  const ringSize = clicking ? 28 : hovering ? 48 : 34;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      {/* Dot — snaps instantly to mouse */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          width: dotSize,
          height: dotSize,
          background: dotColor,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          transition: "width 0.15s ease, height 0.15s ease, background 0.3s ease",
          pointerEvents: "none",
          willChange: "left, top",
        }}
      />
      {/* Ring — follows with smooth easing */}
      <div
        ref={ringRef}
        style={{
          position: "absolute",
          width: ringSize,
          height: ringSize,
          border: `1.5px solid ${ringBorder}`,
          background: ringBg,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          transition:
            "width 0.3s cubic-bezier(0.2,0.8,0.2,1), height 0.3s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s ease, background 0.3s ease",
          pointerEvents: "none",
          willChange: "left, top",
        }}
      />
    </div>
  );
}
