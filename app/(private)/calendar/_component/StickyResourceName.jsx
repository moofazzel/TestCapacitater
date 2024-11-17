import { Tooltip } from "@nextui-org/react";

export default function StickyResourceName({ resourcesData }) {
  return (
    <div className="flex flex-col w-max sticky left-0 z-40 rounded-lg -ml-[13px] gap-3">
      {Object.entries(resourcesData).map(([resourceName, resourceData], i) => {
        return (
          <Tooltip
            key={i}
            className="z-40 flex flex-row items-center my-1"
            placement="right"
            delay={1000}
            closeDelay={50}
            content={
              <>
                <div>
                  <div className="flex items-center">
                    <p className="text-lg font-bold underline">
                      {resourceName}
                    </p>
                    <p className="font-normal no-underline">
                      ({Object.keys(resourceData?.deals).length})
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(resourceData?.deals).map(
                      ([dealId, dealDetails]) => {
                        return (
                          <div
                            key={dealId}
                            className="p-2 border border-green-200 rounded-lg"
                          >
                            <p>Client: {dealDetails.client}</p>
                            <p>Project: {dealDetails.project}</p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            }
          >
            {/* Render the resource name only */}
            <div className="relative flex items-center justify-center h-full px-5 text-xs font-bold bg-green-500 border-2 border-green-500 cursor-pointer min-w-fit max-h-6 rounded-xl">
              {resourceName}
              <small className="bg-green-400  px-1 py-0 rounded-[6px] z-40 font-light text-[7px] absolute -top-[6px] -right-1.5 ">
                {` ${resourceData?.totalMaxCapacity}%`}
              </small>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
