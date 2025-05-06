import { useCallback } from "react";

const useLocalStorage = () => {
  const setItem = useCallback((key, value) => {
    try {
      const val = typeof value === "object" ? JSON.stringify(value) : value;
      localStorage.setItem(key, val);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getItem = useCallback((key) => {
    try {
      const item = localStorage.getItem(key);
      try {
        return JSON.parse(item); 
      } catch {
        return item; 
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);


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
