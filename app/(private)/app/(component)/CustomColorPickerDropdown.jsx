import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { addOrUpdateCategoryColor } from "@/actions/categoryColor";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import colorPickerArrowShape from "@/public/colorPickerArrowShape.svg";
import { Select, SelectItem } from "@nextui-org/react";
import { debounce } from "lodash";
import { CirclePicker, SketchPicker } from "react-color";
import toast from "react-hot-toast";

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

  const handleAddCategoryColor = async (selectedKey, selectedColor) => {
    setLoading(true);
    setNewCategoryUpdate(false);
    try {
      await addOrUpdateCategoryColor(selectedKey, selectedColor);
      toast.success("Category color added successfully.");
      setLoading(false);
      setIsOpen(false);
      setShowAdvancedPicker(false);
      setNewCategoryUpdate(true);
      setSelectedValue(new Set([]));
      setColor("#04BC04"); // Reset to default color
      setPendingColor(null); // Clear pending color
    } catch (error) {
      console.error("Error adding category color:", error);
      toast.error("Error adding category color.");
      setLoading(false);
    }
  };

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

  const handleColorChange = (colorResult) => {
    if (isCooldown) return;

    setColor(colorResult.hex); // Update the UI immediately
    if (colorResult.hex === "custom") {
      toggleAdvancedPicker();
    } else if (selectedValue.size > 0) {
      const selectedKey = Array.from(selectedValue)[0];
      debouncedHandleAddCategoryColor(selectedKey, colorResult.hex); // Use debounced API call
      activateCooldown(); // Prevent spamming with rapid clicks
    } else {
      setPendingColor(colorResult.hex);
      toast("Please select a category to apply the color.");
    }
  };

  const debouncedHandleAddCategoryColor = debounce(
    (selectedKey, selectedColor) => {
      handleAddCategoryColor(selectedKey, selectedColor);
    },
    500, // Delay in milliseconds
    { leading: false, trailing: true } // Trigger only after user stops interacting
  );

  useEffect(() => {
    if (pendingColor && selectedValue.size > 0) {
      // Trigger API call when both color and stage are selected
      const selectedKey = Array.from(selectedValue)[0];
      debouncedHandleAddCategoryColor(selectedKey, pendingColor);
    }
  }, [pendingColor, selectedValue]);

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

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-[40px] h-[40px] bg-[#E6F7E5]   hover:shadow-md transition-shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="30"
          viewBox="0 0 29 30"
          fill="none"
        >
          <rect
            x="0.4"
            y="0.4"
            width="28.2"
            height="29.2"
            fill="#E6F7E5"
            stroke="#04BC04"
            strokeWidth="0.8"
          />
          <path
            d="M23.727 16.3636H15.8179V24.5454H13.1816V16.3636H5.27246V13.6363H13.1816V5.45453H15.8179V13.6363H23.727V16.3636Z"
            fill="#04BC04"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="w-[300px] h-[590px] absolute right-0 top-0 z-[60] mt-2">
          <div className="relative w-full h-full">
            <Image
              className="object-cover w-full h-full max-h-[270px]"
              src={colorPickerArrowShape}
              alt=""
            />

            <div className="absolute top-[60px] left-[30px]">
              <div>
                <p className="block mb-2 text-sm font-medium text-color03">
                  Category Name
                </p>
                {/* Deal Stages */}
                <Select
                  radius="none"
                  label="Select a Stage"
                  className="w-full !bg-white"
                  selectedKeys={selectedValue}
                  onSelectionChange={setSelectedValue}
                  disabledKeys={selectedCategories}
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                >
                  {allDealStages.map((dealStage) => (
                    <SelectItem key={dealStage}>{dealStage}</SelectItem>
                  ))}
                </Select>
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
                          handleAddCategoryColor(selectedKey, color) // Trigger API
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
          </div>
        </div>
      )}
    </div>
  );
}
