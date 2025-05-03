import { useCallback } from "react";

export default function useLocalStorage() {
  const getItem = useCallback((key) => {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(key);

      // If item is null, return null
      if (item === null) return null;

      // Return as-is for simple strings like token
      if (key === "token") return item;

      // Otherwise, parse JSON
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error getting item "${key}" from localStorage`, error);
      return null;
    }
  }, []);


  const setItem = useCallback((key, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item "${key}" to localStorage`, error);
    }
  }, []);

  return { setItem };

  const removeItem = useCallback((key) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item "${key}" from localStorage`, error);
    }
  }, []);

  const clear = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  }, []);

  return { getItem, setItem, removeItem, clear };
}
