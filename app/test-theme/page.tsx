"use client";
import { useTheme } from "@/lib/theme-context";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TestTheme() {
  const { theme, mounted } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Elijah Gallery - Theme Test</h1>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-800 dark:text-gray-200">
              Current theme: <strong>{theme}</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Mounted: <strong>{mounted ? 'Yes' : 'No'}</strong>
            </p>
          </div>
          
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              This should be blue in light mode and dark blue in dark mode.
            </p>
          </div>
          
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              This should be green in light mode and dark green in dark mode.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Click the button above to toggle theme
          </span>
        </div>
        
        <div className="mt-8 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">HTML Classes</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check the HTML element in DevTools - it should have the 'dark' class when in dark mode.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Current classes: {typeof document !== 'undefined' ? document.documentElement.className : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
}
