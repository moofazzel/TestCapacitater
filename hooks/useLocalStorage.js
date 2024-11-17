"use client";

import { useState } from "react";

// Custom hook for using localStorage with state synchronization
export function useLocalStorage(key, initialValue) {
  // Retrieve stored value from localStorage or set initial value
  const readValue = () => {
    if (typeof window === "undefined") {
      console.log("Server-side, returning initial value.");

      return initialValue; // If server-side, return initial value
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Set up state with the localStorage value
  const [storedValue, setStoredValue] = useState(readValue);

  // Function to update both the state and localStorage
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Save the value to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
