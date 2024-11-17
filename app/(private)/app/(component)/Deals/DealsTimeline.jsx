"use client";

import { useSyncVerticalScroll } from "@/hooks/useSyncScroll";
import { forwardRef, useRef } from "react";
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
    },
    _
  ) => {
    const sidebarRef = useRef(null);

    // Hooks to sync scroll between the sidebar and the content
    useSyncVerticalScroll(contentRef, sidebarRef);

    const dealHeight = 50;

    return (
      <div className="flex gap-4 h-[50vh]">
        {/*Deals Sidebar */}
        <div
          ref={sidebarRef}
          className="max-w-[250px] w-full overflow-auto hideScrollBar"
        >
          <DealsTimeLineSideBar
            dataByDealOwners={dataByDealOwners}
            dealHeight={dealHeight}
          >
            {/* Filter Resources for the resources section */}
            <FilterResources
              resourcesData={resourcesData}
              onFilterChange={onResourcesCategoryFilterChange}
            />
          </DealsTimeLineSideBar>
        </div>

        {/*deals Content */}
        <div
          ref={contentRef}
          className="relative w-full overflow-auto border-t border-l border-dashed border-color5 custom-scrollbar"
        >
          <DealsTimeLineContent
            dataByDealOwners={dataByDealOwners} // Filtered and sorted data
            dealHeight={dealHeight}
            allResources={allResources}
          />
        </div>
      </div>
    );
  }
);

DealsTimeline.displayName = "DealsTimeline";

export default DealsTimeline;
