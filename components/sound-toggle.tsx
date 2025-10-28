"use client";
import { useEffect, useState } from "react";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("soundEnabled");
      if (saved !== null) setEnabled(saved === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("soundEnabled", enabled ? "1" : "0"); } catch {}
  }, [enabled]);

  // Keyboard shortcut: press "M" to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "m") return;
      const target = e.target as HTMLElement | null;
      // Ignore when typing in inputs or content editable
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || (target as any).isContentEditable)) return;
      e.preventDefault();
      setEnabled(v => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors text-sm"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sounds (M)" : "Unmute sounds (M)"}
      title={(enabled ? "Mute" : "Unmute") + " (M)"}
   >
      {enabled ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      )}
      <span className="hidden sm:inline">{enabled ? "Sound on" : "Muted"}</span>
    </button>
  );
}

export function isSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem("soundEnabled");
    return saved === null ? true : saved === "1";
  } catch { return true; }
}


