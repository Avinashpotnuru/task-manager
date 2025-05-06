import { useCallback } from "react";

const useLocalStorage = () => {
  // Set value (token/user object) to localStorage with a dynamic key
  const setItem = useCallback((key, value) => {
    try {
      const val = typeof value === "object" ? JSON.stringify(value) : value;
      localStorage.setItem(key, val);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Get value from localStorage with a dynamic key
  const getItem = useCallback((key) => {
    try {
      const item = localStorage.getItem(key);
      try {
        return JSON.parse(item); // Try parsing JSON (for objects)
      } catch {
        return item; // Return as-is (for strings)
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  // Clear item by key
  const clearItem = useCallback((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    setItem,
    getItem,
    clearItem,
  };
};

export default useLocalStorage;
