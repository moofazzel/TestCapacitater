import {
  addOrUpdateCategoryColor,
  deleteCategoryColor,
} from "@/actions/categoryColor";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import colorPickerArrowShape from "@/public/colorPickerArrowShape.svg";
import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { darken } from "polished";
import { useEffect, useRef, useState } from "react";
import { CirclePicker, SketchPicker } from "react-color";
import toast from "react-hot-toast";

export default function UpdateCustomColorPickerDropdown({
  item,
  allDealStages,
  isParentFull,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(item?.bgColor || "#04BC04");
  const [hoveredColorName, setHoveredColorName] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { setNewCategoryUpdate, categoryColors } = useCategoryColorKey();

  // Create a set of currently selected categories to disable
  const selectedCategories = new Set(
    categoryColors?.map((colorItem) => colorItem?.name)
  );
  const [selectedValue, setSelectedValue] = useState(new Set([item.name]));
  const [loading, setLoading] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleColorUpdate = async (colorHex) => {
    setLoading(true);
    setNewCategoryUpdate(false);
    try {
      await addOrUpdateCategoryColor(
        Array.from(selectedValue)[0],
        colorHex,
        item._id
      );
      toast.success("Category color updated successfully.");
      setIsOpen(false);
      setIsPickerOpen(false); // Close picker
      setNewCategoryUpdate(true);
    } catch (error) {
      console.error("Error updating category color:", error);
      toast.error("Error updating category color.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNewCategoryUpdate(false);
    try {
      await deleteCategoryColor(item._id);
      toast.success("Category color deleted successfully.");
      setLoading(false);
      setIsOpen(false);
      setNewCategoryUpdate(true);
    } catch (error) {
      console.log("Error deleting category color:", error);
      toast.error("Failed to delete category color.");
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (item.name === "all others") return;
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (isParentFull) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Detect click outside dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color) => {
    setColor(color.hex);
    handleColorUpdate(color.hex);
  };

  const togglePicker = () => setIsPickerOpen((prev) => !prev);

  const handleColorHover = (colorHex) => {
    const hoveredColor = colorPalette.find(
      (c) => c.hex.toLowerCase() === colorHex.toLowerCase()
    );

    setHoveredColorName(hoveredColor ? hoveredColor.name : "");
  };

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
  ];

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      style={{ cursor: loading ? "wait" : "default" }}
    >
      <div className="flex items-center gap-1">
        <div
          onClick={toggleDropdown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative flex items-center cursor-pointer group"
        >
          <span
            className="size-[30px] mr-[4px]"
            style={{
              backgroundColor: item.bgColor,
              border: `1px solid #d4d4d8`,
            }}
          />

          {isParentFull ? (
            <span
              className={`absolute z-50 px-2 py-1 text-[12px] text-center uppercase -translate-x-1/2 bg-gray-300 left-1/2 -top-10 w-max ${
                showTooltip ? "block" : "hidden"
              }`}
              style={{
                backgroundColor: item.bgColor,
                color: darken(0.9, item.bgColor),
              }}
            >
              {item.name}
            </span>
          ) : (
            <span className="mr-3 uppercase">{item.name}</span>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className={`${
            item.name === "all others" ? "h-[550px]" : "h-[620px]"
          } w-[300px] absolute right-5 top-0 z-[60] mt-2`}
        >
          <form className="relative w-full h-full">
            <Image
              className="object-cover w-full h-full max-h-[290px]"
              src={colorPickerArrowShape}
              alt=""
            />

            <div className="absolute top-[60px] left-[28px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="block mb-2 text-sm font-medium text-color03">
                    Update Category
                  </p>

                  {item.name === "all others" ? null : (
                    <button
                      onClick={handleDelete}
                      title="Delete"
                      className="bg-[#FF0C0C] p-1"
                    >
                      <svg
                        width="15"
                        height="17"
                        viewBox="0 0 15 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.78768 16.653C2.29925 16.653 1.88128 16.4729 1.53375 16.1125C1.18623 15.7521 1.01217 15.3183 1.01158 14.8112V2.83898H0.123535V0.99711H4.56377V0.0761719H9.89205V0.99711H14.3323V2.83898H13.4442V14.8112C13.4442 15.3177 13.2705 15.7515 12.923 16.1125C12.5754 16.4735 12.1572 16.6537 11.6681 16.653H2.78768ZM11.6681 2.83898H2.78768V14.8112H11.6681V2.83898ZM4.56377 12.9693H6.33986V4.68086H4.56377V12.9693ZM8.11596 12.9693H9.89205V4.68086H8.11596V12.9693Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  {/* deal stages */}
                  <Select
                    radius="none"
                    label="Select a Stage"
                    className="w-full !bg-white"
                    defaultSelectedKeys={[item.name]}
                    selectedKeys={[...selectedValue]} // Convert Set to Array here
                    onSelectionChange={setSelectedValue}
                    disabledKeys={Array.from(selectedCategories)}
                    scrollShadowProps={{
                      isEnabled: false,
                    }}
                  >
                    {allDealStages.map((dealStage) => (
                      <SelectItem key={dealStage}>{dealStage}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="mb-4 text-color03">
                <label
                  htmlFor="categoryColor"
                  className="block mb-2 text-sm text-color03"
                >
                  Category Color
                </label>
                <div className="relative mb-4">
                  <div className="relative">
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
                      onClick={togglePicker}
                      onMouseEnter={() => setHoveredColorName("Custom Colors")}
                      onMouseLeave={() => setHoveredColorName("")}
                    />
                  </div>

                  {/* Hovered Color Tooltip */}
                  {hoveredColorName && (
                    <div className="absolute top-[-30px] left-0 bg-gray-700 text-white px-2 py-1 rounded-md text-xs shadow">
                      {hoveredColorName}
                    </div>
                  )}

                  {/* Custom Color Picker */}
                  {isPickerOpen && (
                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-4 bg-white rounded shadow-md">
                      {/* SketchPicker for advanced color selection */}
                      <SketchPicker
                        className="w-full"
                        color={color}
                        onChange={(colorResult) => {
                          // Live update the color preview
                          setColor(colorResult.hex);
                        }}
                      />

                      {/* Full-width Confirmation Button */}
                      <div
                        className={`mt-4 flex items-center justify-center rounded shadow ${
                          loading
                            ? "cursor-not-allowed opacity-50 bg-gray-300" // Disabled state during loading
                            : "cursor-pointer bg-green-500 hover:bg-green-600" // Active state
                        }`}
                        style={{
                          backgroundColor: color, // Reflect selected color
                          width: "100%",
                          height: "40px", // Button height
                        }}
                        onClick={() => {
                          if (!loading) {
                            const selectedKey = Array.from(selectedValue)[0]; // Pre-selected category
                            handleColorUpdate(color); // Trigger API for color update
                          }
                        }}
                      >
                        <span className="text-sm text-center text-gray-900">
                          {loading ? "Updating..." : "Update"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
