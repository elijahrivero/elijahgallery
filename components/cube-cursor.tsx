"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number; t: number };

export default function CubeCursor() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [renderTick, setRenderTick] = useState(0);
  const trailRef = useRef<Point[]>([]);
  const lastMoveRef = useRef<number>(Date.now());

  // Physics params for soft springy movement
  const { stiffness, damping, mass } = useMemo(() => ({
    stiffness: 0.04,
    damping: 0.85,
    mass: 1.0,
  }), []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      lastMoveRef.current = Date.now();
      // Add particle point
      trailRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (trailRef.current.length > 60) trailRef.current.shift();
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove as any);
  }, []);

  // Animation loop
  useEffect(() => {
    let raf = 0;
    const step = () => {
      const targetX = mouse.x;
      const targetY = mouse.y;
      const p = posRef.current;
      // Spring towards target
      const ax = (targetX - p.x) * stiffness;
      const ay = (targetY - p.y) * stiffness;
      p.vx = (p.vx + ax / mass) * damping;
      p.vy = (p.vy + ay / mass) * damping;
      p.x += p.vx;
      p.y += p.vy;

      // Clear old particles
      const now = Date.now();
      trailRef.current = trailRef.current.filter(pt => now - pt.t < 600);

      setRenderTick(t => t + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stiffness, damping, mass, mouse.x, mouse.y]);

  // Bounce scale based on velocity
  const { scale, tiltX, tiltY } = useMemo(() => {
    const { vx, vy } = posRef.current;
    const v = Math.min(1, Math.hypot(vx, vy) / 40);
    const scale = 1 + v * 0.08; // subtle bounce
    const tiltX = vy * 0.12; // degrees
    const tiltY = -vx * 0.12; // degrees
    return { scale, tiltX, tiltY };
  }, [renderTick]);

  // Pastel gradient choices
  const grad = useMemo(() => {
    return "bg-[conic-gradient(at_30%_30%,#fde68a_0deg,#c7d2fe_90deg,#a7f3d0_180deg,#fecaca_270deg,#fde68a_360deg)]";
  }, []);

  // Shadow position (glossy plane)
  const boxX = posRef.current.x;
  const boxY = posRef.current.y;

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      {/* Particle trail */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        {trailRef.current.map((pt, i) => {
          const age = Math.min(1, (Date.now() - pt.t) / 600);
          const opacity = 0.25 * (1 - age);
          const r = 3 + (1 - age) * 4;
          return (
            <circle key={i} cx={pt.x} cy={pt.y} r={r} fill="#a5b4fc" opacity={opacity} />
          );
        })}
      </svg>

      {/* Shadow on plane */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: boxX,
          top: boxY + 18,
        }}
      >
        <div className="w-10 h-3 rounded-full blur-md opacity-40 bg-black/40"></div>
      </div>

      {/* Cube */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: boxX, top: boxY }}
      >
        <div
          className={[
            "w-6 h-6 rounded-[6px]",
            grad,
            "shadow-[0_6px_20px_rgba(0,0,0,0.25)] border border-white/60",
            "backdrop-blur-[2px]",
          ].join(" ")}
          style={{
            transform: `translateZ(0) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          }}
        >
          {/* subtle face highlight */}
          <div className="w-full h-full rounded-[6px] bg-white/10" />
        </div>
      </div>
    </div>
  );
}


