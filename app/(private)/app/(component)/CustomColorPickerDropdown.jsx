import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  addOrUpdateCategoryColor,
  deleteCategoryColor,
} from "@/actions/categoryColor";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import colorPickerArrowShape from "@/public/colorPickerArrowShape.svg";
import { Select, SelectItem } from "@nextui-org/react";
import { debounce } from "lodash";
import { CirclePicker, SketchPicker } from "react-color";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";

export default function CustomColorPickerDropdown({ allDealStages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("#04BC04");
  const [hoveredColorName, setHoveredColorName] = useState("");
  const [pendingColor, setPendingColor] = useState(null);
  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);
  const dropdownRef = useRef(null);
  const [isCooldown, setIsCooldown] = useState(false);

  const { setNewCategoryUpdate, categoryColors = [] } = useCategoryColorKey();

  const [selectedValue, setSelectedValue] = useState(new Set([]));
  const selectedCategories = categoryColors.map((item) => item?.name);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false); // For showing skeleton

  const handleAddOrUpdateCategoryColor = useCallback(
    async (selectedKey, selectedColor) => {
      setLoading(true);
      setDropdownLoading(true);
      try {
        const existingEntry = categoryColors.find(
          (c) => c.name === selectedKey
        );
        const categoryId = existingEntry?._id; // Get the ID for updates

        const response = await addOrUpdateCategoryColor(
          selectedKey,
          selectedColor,
          categoryId
        );

        if (!response || !response.success) {
          throw new Error(response?.message || "Unknown error occurred");
        }

        toast.success(
          categoryId
            ? "Category color updated successfully."
            : "Category color added successfully."
        );

        setLoading(false);
        setDropdownLoading(false);
        setIsOpen(false);
        setShowAdvancedPicker(false);
        setSelectedValue(new Set([]));
        setColor("#04BC04"); // Reset color
        setPendingColor(null);
        setNewCategoryUpdate((prev) => !prev);
      } catch (error) {
        console.error("Error updating category color:", error);
        toast.error(error.message || "Error updating category color.");
        setLoading(false);
      }
    },
    [setNewCategoryUpdate, categoryColors]
  );

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      !e.target.closest(".sketch-picker") // Prevents SketchPicker clicks from closing immediately
    ) {
      setIsOpen(false);
      setShowAdvancedPicker(false); // Ensures SketchPicker also closes
    }
  };

  // Listen for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCategoryColorRef = useRef(handleAddOrUpdateCategoryColor);

  useEffect(() => {
    handleAddCategoryColorRef.current = handleAddOrUpdateCategoryColor;
  }, [handleAddOrUpdateCategoryColor]);

  const debouncedHandleAddCategoryColorRef = useRef();

  useEffect(() => {
    debouncedHandleAddCategoryColorRef.current = debounce(
      (selectedKey, selectedColor, categoryId) => {
        if (handleAddOrUpdateCategoryColor) {
          handleAddOrUpdateCategoryColor(
            selectedKey,
            selectedColor,
            categoryId
          );
        }
      },
      500,
      { leading: false, trailing: true }
    );
  }, [handleAddOrUpdateCategoryColor]);

  useEffect(() => {
    if (pendingColor && selectedValue.size > 0) {
      const selectedKey = Array.from(selectedValue)[0];
      if (debouncedHandleAddCategoryColorRef.current) {
        debouncedHandleAddCategoryColorRef.current(selectedKey, pendingColor);
      }
      setPendingColor(null); // Clear pending color after applying
    }
  }, [pendingColor, selectedValue]);

  const handleColorChange = (colorResult) => {
    if (isCooldown) return;

    setColor(colorResult.hex); // Update the UI immediately

    if (colorResult.hex === "custom") {
      toggleAdvancedPicker(); // Open the advanced color picker
      return;
    }

    if (selectedValue.size > 0) {
      const selectedKey = Array.from(selectedValue)[0];
      const existingEntry = categoryColors.find((c) => c.name === selectedKey);
      const categoryId = existingEntry?._id; // Get the ID if exists

      if (debouncedHandleAddCategoryColorRef.current) {
        debouncedHandleAddCategoryColorRef.current(
          selectedKey,
          colorResult.hex,
          categoryId
        );
      }

      activateCooldown(); // Prevent spamming
    } else {
      setPendingColor(colorResult.hex); // Save pending color if no stage is selected
      toast("Please select a category to apply the color.");
    }
  };

  const activateCooldown = () => {
    setIsCooldown(true); // Enable cooldown
    setTimeout(() => setIsCooldown(false), 1000);
  };

  const toggleAdvancedPicker = () => {
    setShowAdvancedPicker(!showAdvancedPicker);
  };

  const handleColorHover = (colorHex) => {
    // Find the color name based on the hex value
    const hoveredColor = colorPalette.find((c) => c.hex === colorHex);
    if (hoveredColor) {
      setHoveredColorName(hoveredColor.name);
    } else {
      setHoveredColorName("");
    }
  };

  const selectedStage = Array.from(selectedValue)[0] || null;
  const existingEntry = categoryColors.find((c) => c.name === selectedStage);
  const existingColor = existingEntry?.bgColor;
  const existingId = existingEntry?._id;

  // Color palette with names
  const colorPalette = [
    { name: "Red", hex: "#f44336" },
    { name: "Pink", hex: "#e91e63" },
    { name: "Purple", hex: "#9c27b0" },
    { name: "Deep Purple", hex: "#673ab7" },
    { name: "Indigo", hex: "#3f51b5" },
    { name: "Blue", hex: "#2196f3" },
    { name: "Light Blue", hex: "#03a9f4" },
    { name: "Cyan", hex: "#00bcd4" },
    { name: "Teal", hex: "#009688" },
    { name: "Green", hex: "#4caf50" },
    { name: "Light Green", hex: "#8bc34a" },
    { name: "Lime", hex: "#cddc39" },
    { name: "Yellow", hex: "#ffeb3b" },
    { name: "Amber", hex: "#ffc107" },
    { name: "Orange", hex: "#ff9800" },
    { name: "Custom", hex: "custom" },
  ];

  const getColor = (dealStage, border = false) => {
    const colorKey = categoryColors.find(
      (item) => item.name.toLowerCase() === dealStage.toLowerCase()
    );

    let baseColor = colorKey?.bgColor || "#d8d7dc";

    // If a border is required, adjust the color
    if (border) {
      baseColor = darken(0.2, baseColor); // Darkens the color by 20%
    }

    return baseColor;
  };
  const handleDeleteCategoryColor = async (categoryId) => {
    setLoading(true);
    setDropdownLoading(true);
    try {
      await deleteCategoryColor(categoryId);
      toast.success("Category color deleted successfully.");
      setNewCategoryUpdate((prev) => !prev);
      setSelectedValue(new Set([]));
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting category color:", error);
      toast.error("Error deleting category color.");
    } finally {
      setLoading(false);
      setDropdownLoading(false);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-[40px] h-[40px]   hover:shadow-md transition-shadow"
      >
        <svg
          className="transition-colors duration-200 stroke-black fill-white group-hover:fill-white group-hover:stroke-white"
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
        >
          <path
            d="M19.5 9.787H7.145M2.784 9.787H1M2.784 9.787C2.784 9.20883 3.01368 8.65434 3.42251 8.24551C3.83134 7.83668 4.38583 7.607 4.964 7.607C5.54217 7.607 6.09666 7.83668 6.50549 8.24551C6.91432 8.65434 7.144 9.20883 7.144 9.787C7.144 10.3652 6.91432 10.9197 6.50549 11.3285C6.09666 11.7373 5.54217 11.967 4.964 11.967C4.38583 11.967 3.83134 11.7373 3.42251 11.3285C3.01368 10.9197 2.784 10.3652 2.784 9.787ZM19.5 16.394H13.752M13.752 16.394C13.752 16.9723 13.5218 17.5274 13.1128 17.9363C12.7039 18.3453 12.1493 18.575 11.571 18.575C10.9928 18.575 10.4383 18.3443 10.0295 17.9355C9.62068 17.5267 9.391 16.9722 9.391 16.394M13.752 16.394C13.752 15.8157 13.5218 15.2616 13.1128 14.8527C12.7039 14.4437 12.1493 14.214 11.571 14.214C10.9928 14.214 10.4383 14.4437 10.0295 14.8525C9.62068 15.2613 9.391 15.8158 9.391 16.394M9.391 16.394H1M19.5 3.18H16.395M12.034 3.18H1M12.034 3.18C12.034 2.60183 12.2637 2.04734 12.6725 1.63851C13.0813 1.22968 13.6358 1 14.214 1C14.5003 1 14.7838 1.05639 15.0483 1.16594C15.3127 1.2755 15.5531 1.43608 15.7555 1.63851C15.9579 1.84094 16.1185 2.08126 16.2281 2.34575C16.3376 2.61024 16.394 2.89372 16.394 3.18C16.394 3.46628 16.3376 3.74976 16.2281 4.01425C16.1185 4.27874 15.9579 4.51906 15.7555 4.72149C15.5531 4.92392 15.3127 5.0845 15.0483 5.19406C14.7838 5.30361 14.5003 5.36 14.214 5.36C13.6358 5.36 13.0813 5.13032 12.6725 4.72149C12.2637 4.31266 12.034 3.75817 12.034 3.18Z"
            strokeWidth="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="w-[300px] h-[590px] absolute right-0 top-0 z-[60] mt-2">
          <div className="relative w-full h-full">
            {!dropdownLoading && (
              <Image
                className="object-cover w-full h-full max-h-[270px]"
                src={colorPickerArrowShape}
                alt=""
              />
            )}

            {dropdownLoading ? (
              <div className="absolute top-[60px] left-[20px] w-[300px] p-4 bg-white shadow-md rounded-md animate-pulse">
                <div className="space-y-4">
                  <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                  <div className="w-5/6 h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            ) : (
              <div className="absolute top-[60px] left-[30px]">
                <div>
                  <p className="block mb-2 text-sm font-medium text-color03">
                    Category Name
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      radius="none"
                      label="Select a Stage"
                      className="w-full bg-white"
                      selectedKeys={selectedValue}
                      onSelectionChange={setSelectedValue}
                      scrollShadowProps={{ isEnabled: false }}
                    >
                      {allDealStages.map((dealStage) => (
                        <SelectItem
                          key={dealStage}
                          style={{ backgroundColor: getColor(dealStage) }}
                        >
                          {dealStage}
                        </SelectItem>
                      ))}
                    </Select>

                    {/* Show delete button if the stage already has a color */}
                    {existingColor && (
                      <button
                        className="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        onClick={() => handleDeleteCategoryColor(existingId)}
                      >
                        <BsTrash size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-4 text-color03">
                  <label
                    htmlFor="categoryColor"
                    className="block mt-2 mb-2 text-sm text-color03"
                  >
                    Category Color
                  </label>
                  {/* Custom Circle Picker with Multicolor Swatch */}
                  <div
                    className={`relative ${
                      isCooldown ? "pointer-events-none cursor-not-allowed" : ""
                    }`}
                  >
                    <CirclePicker
                      color={color}
                      onChangeComplete={handleColorChange}
                      onSwatchHover={(color) => handleColorHover(color.hex)}
                      circleSize={24}
                      circleSpacing={6}
                      colors={colorPalette.map((c) => c.hex)}
                    />
                    {/* Custom Multicolor Swatch Overlay */}
                    <div
                      className="absolute w-[26px] h-[26px] border-2 border-white rounded-full cursor-pointer bottom-[5px] right-[11px]"
                      style={{
                        background: `conic-gradient(red, yellow, green, cyan, blue, magenta, red)`,
                      }}
                      onClick={toggleAdvancedPicker}
                      onMouseEnter={() => setHoveredColorName("Custom Colors")}
                      onMouseLeave={() => setHoveredColorName("")}
                    ></div>
                    {/* Hovered Color Tooltip */}
                    {hoveredColorName && (
                      <div className="absolute top-[-30px] left-0 bg-gray-700 text-white px-2 py-1 rounded-md text-xs shadow">
                        {hoveredColorName}
                      </div>
                    )}
                  </div>

                  {showAdvancedPicker && (
                    <div className="relative z-10 flex flex-col items-center justify-center p-2 bg-white shadow">
                      {/* SketchPicker for color selection */}
                      <SketchPicker
                        className="w-full"
                        color={color}
                        onChange={(colorResult) => {
                          // Update the color preview without triggering the API
                          setColor(colorResult.hex);
                        }}
                      />

                      {/* Confirmation Button */}
                      <div
                        className={`flex items-center justify-center mt-2 bg-white border border-gray-300 rounded shadow ${
                          selectedValue.size === 0 || loading
                            ? "cursor-not-allowed opacity-50" // Disabled state
                            : "cursor-pointer" // Active state
                        }`}
                        onClick={() => {
                          if (selectedValue.size > 0 && !loading) {
                            const selectedKey = Array.from(selectedValue)[0];
                            setLoading(true); // Start loading state
                            handleAddOrUpdateCategoryColor(selectedKey, color) // Trigger API
                              .then(() => {})
                              .catch((error) => {
                                console.error("Error applying color:", error);
                                toast.error("Failed to apply color.");
                              })
                              .finally(() => {
                                setLoading(false); // Stop loading state
                              });
                          }
                        }}
                        style={{
                          backgroundColor:
                            selectedValue.size > 0 && !loading ? color : "#ddd", // Reflect color or gray out when disabled/loading
                          width: "calc(100% - 8px)",
                          height: "40px",
                        }}
                      >
                        <span className="text-sm text-center text-gray-900">
                          {loading
                            ? "Applying..." // Loading text
                            : selectedValue.size > 0
                            ? "Select" // Enabled button text
                            : "Select a Category First"}{" "}
                          {/* Disabled button text */}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
