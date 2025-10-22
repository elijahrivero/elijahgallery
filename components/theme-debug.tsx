"use client";
import { useTheme } from "@/lib/theme-context";

export function ThemeDebug() {
  const { theme, mounted } = useTheme();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 rounded-lg text-xs font-mono z-50">
      Theme: {theme} | Mounted: {mounted ? 'Yes' : 'No'}
    </div>
  );
}
