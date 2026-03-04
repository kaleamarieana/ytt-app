"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "ytt-theme-preference";

const getTimeBasedTheme = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 6 && currentHour < 18 ? "day" : "night";
};

export function useThemePreference() {
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window === "undefined") return "auto";
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "day" || savedTheme === "night" || savedTheme === "auto"
      ? savedTheme
      : "auto";
  });
  const [timeTheme, setTimeTheme] = useState(getTimeBasedTheme);

  const activeTheme = themePreference === "auto" ? timeTheme : themePreference;

  useEffect(() => {
    if (themePreference !== "auto") return undefined;
    const intervalId = window.setInterval(() => {
      setTimeTheme(getTimeBasedTheme());
    }, 60_000);
    return () => window.clearInterval(intervalId);
  }, [themePreference]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  }, [themePreference]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.style.colorScheme = activeTheme === "night" ? "dark" : "light";
  }, [activeTheme]);

  const toggleTheme = () => {
    setThemePreference(activeTheme === "night" ? "day" : "night");
  };

  return { activeTheme, toggleTheme, themePreference, setThemePreference };
}
