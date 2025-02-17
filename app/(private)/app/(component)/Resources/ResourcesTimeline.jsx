import { useSyncVerticalScroll } from "@/hooks/useSyncScroll";
import { forwardRef, useEffect, useRef, useState } from "react";
import ResourcesTimeLineContent from "./ResourcesTimeLineContent";
import ResourcesTimeLineSidebar from "./ResourcesTimeLineSidebar";

const ResourcesTimeline = forwardRef(
  ({ contentRef, resourcesData, totalResourcesLength, resourcesForDeals }) => {
    const sidebarRef = useRef(null);

    // State to track hover state of the resource row timeline and name
    const [isHoveredRow, setIsHoveredRow] = useState(null);

    // State to store the height of the sidebar to match the sidebar height with the resources timeline content and gird
    const [sidebarHeight, setSidebarHeight] = useState("auto");

    // Hooks to sync scroll between the sidebar and the content
    useSyncVerticalScroll(contentRef, sidebarRef);

    useEffect(() => {
      // Calculate the sidebar height based on resourcesData
      if (sidebarRef.current) {
        setSidebarHeight(sidebarRef.current.scrollHeight); // Set height based on the sidebar's content
      }
    }, [resourcesData]);

    return (
      <div className="flex gap-4 h-full">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          style={{ height: "300px" }}
          className="flex-shrink-0 w-full sm:max-w-[10px] md:max-w-[50px] lg:max-w-[40px] xl:max-w-[70px] overflow-auto hideScrollBar"
        >
          <ResourcesTimeLineSidebar
            resourcesData={resourcesData}
            resourcesForDeals={resourcesForDeals}
            // hover state
            isHoveredRow={isHoveredRow}
            setIsHoveredRow={setIsHoveredRow}
          />
        </div>
        {/* Content */}
        <div
          ref={contentRef}
          style={{ height: "315px" }}
          className="overflow-y-auto w-full overflow-x-hiddenf"
        >
          <ResourcesTimeLineContent
            resourcesData={resourcesData}
            totalResourcesLength={totalResourcesLength}
            sidebarHeight={sidebarHeight}
            // hover state
            isHoveredRow={isHoveredRow}
            setIsHoveredRow={setIsHoveredRow}
          />
        </div>
      </div>
    );
  }
);

ResourcesTimeline.displayName = "ResourcesTimeline";

export default ResourcesTimeline;
