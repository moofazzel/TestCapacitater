import { useSyncVerticalScroll } from "@/hooks/useSyncScroll";
import { forwardRef, useEffect, useRef, useState } from "react";
import ResourcesTimeLineContent from "./ResourcesTimeLineContent";
import ResourcesTimeLineSidebar from "./ResourcesTimeLineSidebar";

const ResourcesTimeline = forwardRef(
  ({ contentRef, resourcesData, totalResourcesLength }) => {
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
          className="max-w-[250px] w-full overflow-auto hideScrollBar pb-3 pt-5"
        >
          <ResourcesTimeLineSidebar resourcesData={resourcesData} />
        </div>
        {/* Content */}
        <div
          ref={contentRef}
          className="w-full overflow-x-hidden overflow-y-auto"
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
