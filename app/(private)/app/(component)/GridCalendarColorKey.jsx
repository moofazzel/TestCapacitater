"use client";

import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import { throttle } from "lodash";
import { darken } from "polished";
import { useEffect, useMemo, useRef, useState } from "react";
import CategoryColorKeySkeleton from "./CategoryColorKeySkeleton";
import CustomColorPickerDropdown from "./CustomColorPickerDropdown";

const GridCalendarColorKey = ({ allDealStages, onDealStageFilterChange }) => {
  const { categoryColors = [], loading } = useCategoryColorKey();

  const parentRef = useRef(null);
  const childRef = useRef(null);
  const [isParentFull, setIsParentFull] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const getInitialDealStageFilter = () => {
    const savedDealStageFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedDealStages")
        : null;
    return savedDealStageFilter
      ? new Set(JSON.parse(savedDealStageFilter))
      : new Set([]);
  };

  const [dealStageFilter, setDealStageFilter] = useState(
    getInitialDealStageFilter
  );

  const onDealStageFilterChangeRef = useRef(onDealStageFilterChange);

  useEffect(() => {
    onDealStageFilterChangeRef.current = onDealStageFilterChange;
  }, [onDealStageFilterChange]);

  useEffect(() => {
    // Get only the visible deal stages (not in the hidden list)
    const visibleDealStages = allDealStages.filter(
      (stage) => !dealStageFilter.has(stage)
    );

    // Pass the updated visible list to parent
    onDealStageFilterChangeRef.current(visibleDealStages);

    // Save hidden stages in localStorage
    localStorage.setItem(
      "selectedDealStages",
      JSON.stringify([...dealStageFilter])
    );
  }, [dealStageFilter, allDealStages]);

  const defaultCategoryColor = {
    name: "all others",
    bgColor: "#d8d7dc",
  };

  const allOthersCategoryColors = useMemo(
    () => [
      ...categoryColors?.filter(
        (item) => item?.name.toLowerCase() !== "all others"
      ),
      defaultCategoryColor, // Add default category at the end
    ],
    [categoryColors]
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

      // Capture current refs in local variables
      const parentElement = parentRef.current;
      const childElement = childRef.current;

      if (parentElement) {
        resizeObserver.observe(parentElement);
      }

      if (childElement) {
        resizeObserver.observe(childElement);
      }

      return () => {
        if (parentElement) resizeObserver.unobserve(parentElement);
        if (childElement) resizeObserver.unobserve(childElement);
        resizeObserver.disconnect();
        throttledCheckIfParentFull.cancel(); // Cancel the throttled function on unmount
      };
    }
  }, [isParentFull, categoryColors, allOthersCategoryColors]);

  const toggleDealStageFilter = (dealStage) => {
    setDealStageFilter((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealStage)) {
        newSet.delete(dealStage); // Remove from hidden list (make visible)
      } else {
        newSet.add(dealStage); // Add to hidden list (hide it)
      }
      return newSet;
    });
  };

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
                const isDisabled = item.name.toLowerCase() === "all others";
                return (
                  <div
                    key={i}
                    className={`relative inline-block cursor-pointer ${
                      isDisabled ? "pointer-events-none" : ""
                    }`}
                    onClick={() => toggleDealStageFilter(item.name)} // Toggle the filter
                    onMouseEnter={() => setShowTooltip(i)} // Set tooltip for this item
                    onMouseLeave={() => setShowTooltip(null)} // Remove tooltip
                  >
                    <div className="flex items-center gap-1">
                      <div className="relative flex items-center">
                        {/* Square Color Box */}
                        <span
                          className="size-[30px] mr-[4px] border border-gray-300 flex justify-center items-center"
                          style={{
                            backgroundColor: item.bgColor,
                            position: "relative",
                          }}
                        >
                          {/* Show "X" if this stage is selected and should be hidden */}
                          {dealStageFilter.has(item.name) && (
                            <span
                              className="absolute text-lg font-bold text-white"
                              style={{
                                color: "#fff",
                                textShadow: "1px 1px 2px black",
                              }}
                            >
                              ✖
                            </span>
                          )}
                        </span>

                        {/* Show Tooltip on Hover */}
                        {isParentFull ? (
                          <span
                            className={`absolute z-50 px-2 py-1 text-[12px] text-center uppercase -translate-x-1/2 bg-gray-300 left-1/2 -top-10 w-max ${
                              showTooltip === i ? "block" : "hidden"
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
                  </div>
                );
              })}
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
