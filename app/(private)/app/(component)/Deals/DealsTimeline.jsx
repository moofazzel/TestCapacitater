"use client";

import { useSyncVerticalScroll } from "@/hooks/useSyncScroll";
import { forwardRef, useRef } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import DealsTimeLineContent from "./DealsTimeLineContent";
import DealsTimeLineSideBar from "./DealsTimeLineSideBar";
import FilterResources from "./FilterResources";

const DealsTimeline = forwardRef(
  (
    {
      contentRef,
      dataByDealOwners,
      allResources,
      resourcesData,
      onResourcesCategoryFilterChange,
      onResourcesDynamicFilterChange,
      showResources,
    },
    _
  ) => {
    const sidebarRef = useRef(null);

    // Hook to sync vertical scrolling between sidebar and content
    useSyncVerticalScroll(contentRef, sidebarRef);

    return (
      <ResizableBox
        width={Infinity}
        height={window.innerHeight * 0.5} // Set default height to 50% of the viewport height
        minConstraints={[Infinity, window.innerHeight * 0.3]} // Minimum height: 30% of viewport
        maxConstraints={[Infinity, window.innerHeight * 0.8]} // Maximum height: 80% of viewport
        resizeHandles={["s"]}
        className="flex h-full gap-4"
      >
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="flex-shrink-0 w-full sm:max-w-[10px] md:max-w-[50px] lg:max-w-[40px] xl:max-w-[70px] overflow-auto hideScrollBar"
          style={{ height: "100%" }} // Match ResizableBox's height
        >
          <DealsTimeLineSideBar
            dataByDealOwners={dataByDealOwners}
            dealHeight={50} // Fixed deal height
          >
            {showResources && (
              <FilterResources
                resourcesData={resourcesData}
                onFilterChange={onResourcesCategoryFilterChange}
                onDynamicFilterChange={onResourcesDynamicFilterChange}
              />
            )}
          </DealsTimeLineSideBar>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="relative flex-grow overflow-auto border-t border-l border-dashed border-color5"
        >
          <DealsTimeLineContent
            dataByDealOwners={dataByDealOwners}
            dealHeight={50}
            allResources={allResources}
          />
        </div>
      </ResizableBox>
    );
  }
);

DealsTimeline.displayName = "DealsTimeline";

export default DealsTimeline;
