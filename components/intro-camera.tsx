"use client";
import { useEffect, useRef, useState } from "react";
import { isSoundEnabled } from "@/components/sound-toggle";

// Simple SVG camera icon for the animation
function CameraIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="#111827"/>
      <path d="M8 6.5C8.5 5.2 9.2 4.5 10.5 4.5H13.5C14.8 4.5 15.5 5.2 16 6.5H8Z" fill="#1f2937"/>
      <circle cx="12" cy="12" r="4" fill="#0ea5e9"/>
      <circle cx="12" cy="12" r="2.2" fill="#67e8f9"/>
      <circle cx="18" cy="9" r="1" fill="#fca5a5"/>
    </svg>
  );
}

type IntroCameraProps = { onDone?: () => void };

export default function IntroCamera({ onDone }: IntroCameraProps) {
  const [show, setShow] = useState(false);
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playShutter = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioContextCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContextCtor();
      const ctx = audioCtxRef.current;

      const now = ctx.currentTime;

      // Master gain
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0, now);
      master.gain.linearRampToValueAtTime(0.7, now + 0.005);
      master.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      master.connect(ctx.destination);

      // Low thump (shutter body)
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      oscLow.type = "triangle";
      oscLow.frequency.setValueAtTime(140, now);
      oscLow.frequency.exponentialRampToValueAtTime(60, now + 0.12);
      gainLow.gain.setValueAtTime(0.0, now);
      gainLow.gain.linearRampToValueAtTime(0.6, now + 0.01);
      gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      oscLow.connect(gainLow).connect(master);
      oscLow.start(now);
      oscLow.stop(now + 0.2);

      // High click
      const oscHi = ctx.createOscillator();
      const gainHi = ctx.createGain();
      oscHi.type = "square";
      oscHi.frequency.setValueAtTime(1800, now);
      gainHi.gain.setValueAtTime(0.0, now);
      gainHi.gain.linearRampToValueAtTime(0.4, now + 0.003);
      gainHi.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      oscHi.connect(gainHi).connect(master);
      oscHi.start(now);
      oscHi.stop(now + 0.06);

      // Short noise burst (shutter leaves)
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.005);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.connect(noiseGain).connect(master);
      noise.start(now);
      noise.stop(now + 0.1);
    } catch {}
  };

  useEffect(() => {
    // Only run once per session
    if (typeof window === "undefined") return;
    const hasSeen = sessionStorage.getItem("introCameraSeen");
    if (hasSeen) return; // skip if already seen

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Skip animation: directly reveal content and scroll gently to gallery
      setShow(false);
      const gallery = document.getElementById("gallery");
      if (gallery) gallery.scrollIntoView({ behavior: "smooth", block: "start" });
      if (onDone) onDone();
      return;
    }

    setShow(true);
    sessionStorage.setItem("introCameraSeen", "1");

    const logo = document.getElementById("site-logo");
    if (!logo) return;

    const camera = cameraRef.current;
    if (!camera) return;

    // Starting off-screen position (bottom-left)
    const startX = -120;
    const startY = window.innerHeight + 120;
    camera.style.transform = `translate(${startX}px, ${startY}px) scale(1)`;

    // Target: logo center
    const logoRect = logo.getBoundingClientRect();
    const targetX = logoRect.left + logoRect.width / 2 - 32; // center minus icon half
    const targetY = logoRect.top + logoRect.height / 2 - 32;

    // Midway control point for a nicer curve
    const midX = window.innerWidth * 0.35;
    const midY = window.innerHeight * 0.25;

    // Animate via WAAPI for smoother timing control
    const pathKeyframes = [
      { transform: `translate(${startX}px, ${startY}px) scale(1)` },
      { transform: `translate(${midX}px, ${midY}px) scale(1.05)` },
      { transform: `translate(${targetX}px, ${targetY}px) scale(1)` },
    ];

    const timing: KeyframeAnimationOptions = {
      duration: 1600,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    };

    const anim = camera.animate(pathKeyframes, timing);
    anim.onfinish = () => {
      // Flash & optional sound
      if (isSoundEnabled()) playShutter();
      setFlash(true);
      setTimeout(() => setFlash(false), 180);

      // Small click bounce
      camera.animate([
        { transform: `translate(${targetX}px, ${targetY}px) scale(1)` },
        { transform: `translate(${targetX}px, ${targetY + 2}px) scale(0.97)` },
        { transform: `translate(${targetX}px, ${targetY}px) scale(1)` },
      ], { duration: 220, easing: "ease-out" });

      // Fade out overlay and gently scroll to gallery section if present
      setTimeout(() => {
      setShow(false);
        const gallery = document.getElementById("gallery");
        if (gallery) gallery.scrollIntoView({ behavior: "smooth", block: "start" });
        if (onDone) onDone();
      }, 250);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* subtle dark overlay for focus */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      {/* flash layer */}
      {flash && <div className="absolute inset-0 bg-white/90 animate-[fadeFlash_200ms_ease]" />}

      {/* camera sprite */}
      <div ref={cameraRef} className="absolute will-change-transform drop-shadow-2xl">
        <CameraIcon />
      </div>

      <style jsx global>{`
        @keyframes fadeFlash { from { opacity: 1 } to { opacity: 0 } }
      `}</style>
    </div>
  );
}
