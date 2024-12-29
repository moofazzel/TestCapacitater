import ResourcesGrid from "./ResourcesGrid";
import ResourcesTimelineInnerContent from "./ResourcesTimelineInnerContent";

const ResourcesTimeLineContent = ({
  resourcesData,
  totalResourcesLength,
  sidebarHeight,
}) => {
  return (
    <div className="relative w-full h-full">
      <ResourcesGrid
        totalResourcesLength={totalResourcesLength}
        sidebarHeight={sidebarHeight}
      />

      <ResourcesTimelineInnerContent resourcesData={resourcesData} />
    </div>
  );
};

export default ResourcesTimeLineContent;
