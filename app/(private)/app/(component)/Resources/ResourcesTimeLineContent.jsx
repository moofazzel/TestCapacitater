import ResourcesGrid from "./ResourcesGrid";
import ResourcesTimelineInnerContent from "./ResourcesTimelineInnerContent";

const ResourcesTimeLineContent = ({
  resourcesData,
  totalResourcesLength,
  sidebarHeight,
  isHoveredRow,
  setIsHoveredRow,
}) => {
  return (
    <div className="relative pt-4 w-full h-full">
      <ResourcesGrid
        totalResourcesLength={totalResourcesLength}
        sidebarHeight={sidebarHeight}
      />

      <ResourcesTimelineInnerContent
        resourcesData={resourcesData}
        isHoveredRow={isHoveredRow}
        setIsHoveredRow={setIsHoveredRow}
      />
    </div>
  );
};

export default ResourcesTimeLineContent;
