const ResourcesTimeLineSidebar = ({ resourcesData }) => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-5">
      {Object.entries(resourcesData).map(
        ([resourceName, resourceData], index) => {
          return (
            <div
              key={index}
              className="px-2  text-[14px] xl:text-lg font-medium text-center border justify-center items-center lg:px-6 border-color5 text-color02 capitalize flex flex-col w-full gap-1 h-[76px]"
            >
              <div> {resourceName}</div>
              <div className="text-base font-normal ">
                <span>Designer</span> |{" "}
                <span className="ml-2 bg-color5 text-white px-2.5 py-0.5 text-center">
                  {resourceData?.totalMaxCapacity}%
                </span>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ResourcesTimeLineSidebar;
