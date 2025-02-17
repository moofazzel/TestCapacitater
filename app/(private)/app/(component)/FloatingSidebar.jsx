import { useState } from "react";

export const FloatingSidebar = ({ toggleResources }) => {
  const [showResources, setShowResources] = useState(true);

  const handleToggle = () => {
    setShowResources(!showResources);
    toggleResources(); // Function passed from parent to manage the state.
  };

  return (
    <div className="absolute z-50 -bottom-14 right-10">
      {/* Floating button to toggle Resources visibility */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-3 px-6 font-medium py-3 text-gray-700 transition-all duration-500 rounded-full shadow-lg bg-[#70d167] hover:bg-[#70d167]"
      >
        {showResources ? "➖ Hide" : "➕ Show"} {/* Icon toggle */}
      </button>
    </div>
  );
};
