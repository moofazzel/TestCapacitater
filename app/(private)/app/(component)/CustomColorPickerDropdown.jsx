import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { addOrUpdateCategoryColor } from "@/actions/categoryColor";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import colorPickerArrowShape from "@/public/colorPickerArrowShape.svg";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { SketchPicker } from "react-color";
import toast from "react-hot-toast";

export default function CustomColorPickerDropdown({ allDealStages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("#04BC04");
  const dropdownRef = useRef(null);

  const { setNewCategoryUpdate, categoryColors = [] } = useCategoryColorKey();

  const [selectedValue, setSelectedValue] = useState(new Set([]));

  const selectedCategories = categoryColors.map((item) => item.name);

  const [loading, setLoading] = useState(false);

  const handleAddCategoryColor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNewCategoryUpdate(false);
    try {
      await addOrUpdateCategoryColor(selectedValue.currentKey, color);
      toast.success("Category color added successfully.");
      setLoading(false);
      setIsOpen(false);
      setNewCategoryUpdate(true);
      setSelectedValue(new Set([]));
      setColor("");
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

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Listen for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Directly update the color on every change
  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={toggleDropdown}>
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
        <div className=" w-[300px] h-[590px] absolute right-0 top-0 z-[60]  p-2 mt-2">
          <form
            onSubmit={handleAddCategoryColor}
            className="relative w-full h-full"
          >
            <Image
              className="object-cover w-full h-full"
              src={colorPickerArrowShape}
              alt=""
            />

            <div className="absolute top-[60px] left-[32px] ">
              <div>
                <p className="block mb-2 text-sm font-medium text-color03">
                  Category Name
                </p>
                {/* deal stages */}
                <Select
                  radius="none"
                  label="Select an Stage"
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
                  className="block mb-2 text-sm text-color03"
                >
                  Category Color
                </label>
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>

              <Button
                type="submit"
                variant="solid"
                color="success"
                radius="none"
                className="w-full"
                isLoading={loading}
                isDisabled={!selectedValue.currentKey || !color}
              >
                Add
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
