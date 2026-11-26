"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    root.style.colorScheme = isDark ? "dark" : "light";

    try {
      window.localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // The preference cannot be persisted; the current page still switches.
    }

    const background = window
      .getComputedStyle(root)
      .getPropertyValue("--background")
      .trim();

    if (!background) {
      return;
    }

    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", background));
  }

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={toggleTheme}
      className={cn("header-button", className)}
    >
      <Moon aria-hidden="true" className="dark:hidden" strokeWidth={1.65} />
      <Sun aria-hidden="true" className="hidden dark:block" strokeWidth={1.65} />
    </button>
  );
}
