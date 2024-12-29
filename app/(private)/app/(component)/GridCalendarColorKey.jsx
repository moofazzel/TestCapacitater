"use client";

import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import { throttle } from "lodash";
import { useEffect, useRef, useState } from "react";
import CategoryColorKeySkeleton from "./CategoryColorKeySkeleton";
import CustomColorPickerDropdown from "./CustomColorPickerDropdown";
import UpdateCustomColorPickerDropdown from "./UpdateCustomColorPickerDropdown";

const GridCalendarColorKey = ({ allDealStages }) => {
  const { categoryColors = [], loading } = useCategoryColorKey();

  const parentRef = useRef(null);
  const childRef = useRef(null);
  const [isParentFull, setIsParentFull] = useState(false);

  const defaultCategoryColor = {
    name: "all others",
    bgColor: "#d8d7dc",
  };

  const allOthersCategoryColors = categoryColors?.filter(
    (item) => item?.name.toLowerCase() !== "all others"
  );

  useEffect(() => {
    // Check if the parent is full by comparing child and parent widths
    const checkIfParentFull = () => {
      const childElement = childRef.current;

      if (parentRef.current && childElement) {
        const parentElement = parentRef.current;

        // Get the widths of both parent and child
        const parentWidth = parentElement.clientWidth;
        const childWidth = childElement.clientWidth + 150; // Adding extra width for safety

        // Check if the child element width is close to or equal to the parent width
        const isFull = childWidth >= parentWidth;

        // Only update state if it is false and now becomes true
        if (!isParentFull && isFull) {
          setIsParentFull(true);
        }
      }
    };

    // Run the check only if isParentFull is still false
    if (!isParentFull) {
      // Throttle the resize observer callback to avoid frequent updates
      const throttledCheckIfParentFull = throttle(checkIfParentFull, 200);

      // Initial check
      throttledCheckIfParentFull();

      // Set up a ResizeObserver to monitor changes in size
      const resizeObserver = new ResizeObserver(() => {
        throttledCheckIfParentFull();
      });

      if (parentRef.current) {
        resizeObserver.observe(parentRef.current);
      }

      if (childRef.current) {
        resizeObserver.observe(childRef.current);
      }

      return () => {
        if (parentRef.current) resizeObserver.unobserve(parentRef.current);
        if (childRef.current) resizeObserver.unobserve(childRef.current);
        resizeObserver.disconnect();
        throttledCheckIfParentFull.cancel(); // Cancel the throttled function on unmount
      };
    }
  }, [isParentFull, categoryColors, allOthersCategoryColors]);

  return (
    <div ref={parentRef} className="flex justify-end w-full">
      <div
        ref={childRef}
        className="flex items-center flex-wrap lg:flex-nowrap px-[15px] py-[6px] gap-[10px] lg:gap-[10px] xl:gap-[20px] border custom-shadow border-color5 text-[10px] lg:text-[12px] 3xl:text-[16px] text-color02 w-fit"
      >
        {loading && <CategoryColorKeySkeleton />}

        <div className="flex flex-wrap">
          {categoryColors && !loading && (
            <>
              {allOthersCategoryColors?.map((item, i) => {
                return (
                  // Update existing category color
                  <UpdateCustomColorPickerDropdown
                    key={item._id}
                    item={item}
                    allDealStages={allDealStages}
                    isParentFull={isParentFull}
                  />
                );
              })}
              {/* Default category color */}
              <UpdateCustomColorPickerDropdown
                item={defaultCategoryColor}
                allDealStages={allDealStages}
                isParentFull={isParentFull}
              />
            </>
          )}
        </div>

        {/* create new category color */}
        <CustomColorPickerDropdown allDealStages={allDealStages} />
      </div>
    </div>
  );
};

export default GridCalendarColorKey;
