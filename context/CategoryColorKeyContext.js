"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const CategoryColorKeyContext = createContext();

// Create a provider component
export function CategoryColorKeyProvider({ children }) {
  const [newCategoryUpdate, setNewCategoryUpdate] = useState(false);
  const [categoryColors, setCategoryColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch category colors
  useEffect(() => {
    async function fetchCategoryColors() {
      try {
        const response = await fetch(`/api/categoryColors`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setCategoryColors(data);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryColors();
  }, [newCategoryUpdate]);

  return (
    <CategoryColorKeyContext.Provider
      value={{
        loading,
        categoryColors: categoryColors?.categories,
        setNewCategoryUpdate,
      }}
    >
      {children}
    </CategoryColorKeyContext.Provider>
  );
}

// Custom hook for consuming the context
export function useCategoryColorKey() {
  return useContext(CategoryColorKeyContext);
}
