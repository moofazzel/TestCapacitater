import { useSyncVerticalScroll } from "@/hooks/useSyncScroll";
import { forwardRef, useEffect, useRef, useState } from "react";
import ResourcesTimeLineContent from "./ResourcesTimeLineContent";
import ResourcesTimeLineSidebar from "./ResourcesTimeLineSidebar";

const ResourcesTimeline = forwardRef(
  ({ contentRef, resourcesData, totalResourcesLength, resourcesForDeals }) => {
    const sidebarRef = useRef(null);

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
      <div className="flex h-full gap-4 ">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="pb-3 pt-5 flex-shrink-0 w-full sm:max-w-[10px] md:max-w-[50px] lg:max-w-[40px] xl:max-w-[70px] overflow-auto hideScrollBar"
        >
          <ResourcesTimeLineSidebar
            resourcesData={resourcesData}
            resourcesForDeals={resourcesForDeals}
          />
        </div>
        {/* Content */}
        <div
          ref={contentRef}
          className="w-full overflow-y-auto overflow-x-hiddenf"
        >
          <ResourcesTimeLineContent
            resourcesData={resourcesData}
            totalResourcesLength={totalResourcesLength}
            sidebarHeight={sidebarHeight}
          />
        </div>
      </div>
    );
  }
);

ResourcesTimeline.displayName = "ResourcesTimeline";

export default ResourcesTimeline;
