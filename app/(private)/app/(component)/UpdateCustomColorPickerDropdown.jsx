import {
  addOrUpdateCategoryColor,
  deleteCategoryColor,
} from "@/actions/categoryColor";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import colorPickerArrowShape from "@/public/colorPickerArrowShape.svg";
import { Button, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import toast from "react-hot-toast";

export default function UpdateCustomColorPickerDropdown({
  item,
  allDealStages,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(item.bgColor || "#04BC04");
  const dropdownRef = useRef(null);

  const { setNewCategoryUpdate, categoryColors } = useCategoryColorKey();

  // Create a set of currently selected categories to disable
  const selectedCategories = new Set(
    categoryColors.map((colorItem) => colorItem.name)
  );
  const [selectedValue, setSelectedValue] = useState(new Set([item.name]));
  const [loading, setLoading] = useState(false);

  const handleAddCategoryColor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNewCategoryUpdate(false);
    try {
      await addOrUpdateCategoryColor(
        Array.from(selectedValue)[0],
        color,
        item._id
      );
      toast.success("Category color updated successfully.");
      setLoading(false);
      setIsOpen(false);
      setNewCategoryUpdate(true);
    } catch (error) {
      console.error("Error updating category color:", error);
      toast.error("Error updating category color.");
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
      toast.error("Error deleting category color.");
      setLoading(false);
    }
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color) => setColor(color.hex);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex items-center gap-1">
        <div
          onClick={toggleDropdown}
          className="flex items-center cursor-pointer"
        >
          <span
            className="size-[16px] lg:size-[25px] xl:size-[30px] mr-[6px] lg:mr-[8px] xl:mr-[10px]"
            style={{
              backgroundColor: item.bgColor,
              border: `1px solid #d4d4d8`,
            }}
          />
        </div>
        <span className="uppercase">{item.name}</span>
      </div>

      {isOpen && (
        <div
          className={`${
            item.name === "all others" ? "h-[550px]" : "h-[620px]"
          } w-[300px] absolute right-5 top-0 z-[60] p-2 mt-2`}
        >
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
                    label="Select an Stage"
                    className="w-full !bg-white"
                    defaultSelectedKeys={[item.name]}
                    selectedKeys={selectedValue}
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
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>

              {item.name === "all others" ? null : (
                <Button
                  type="submit"
                  variant="solid"
                  color="success"
                  radius="none"
                  className="w-full"
                  isLoading={loading}
                >
                  Update
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
