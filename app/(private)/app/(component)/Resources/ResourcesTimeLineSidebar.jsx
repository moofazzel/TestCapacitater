"use client";

import backgroundSVG from "@/public/resourceShape.png";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Image from "next/image";
import { darken } from "polished";

// Utility function to truncate names
const truncateName = (name) => {
  const [firstName] = name.split(" ");
  return name.length > 5 ? `${firstName}...` : name;
};

function getCapacityColor(usedCapacity, totalCapacity) {
  if (totalCapacity === 0) {
    // Edge case: No capacity defined, treat as green
    return "green";
  }

  // Calculate thresholds
  const greenThreshold = 0.85 * totalCapacity; // 85% of total capacity
  const yellowThreshold = totalCapacity; // 100% of total capacity

  // Determine color
  if (usedCapacity <= greenThreshold) {
    return "green"; // Green: < 85%
  } else if (usedCapacity > greenThreshold && usedCapacity <= yellowThreshold) {
    return "yellow"; // Yellow: 85–100%
  } else {
    return "red"; // Red: > 100%
  }
}

const ResourcesTimeLineSidebar = ({ resourcesData, resourcesForDeals }) => {
  return (
    <div className="relative flex flex-col items-stretch w-full gap-16">
      {Object.entries(resourcesData).map(
        ([resourceName, resourceData], index) => {
          const resourcesBgColor = getCapacityColor(
            resourcesForDeals[resourceName]?.totalCurrentTaskCapacity || 0,
            resourceData?.totalMaxCapacity || 0
          );
          return (
            <div
              key={index}
              className="relative border border-color5 bg-gray-50"
              style={{
                height: `${resourceData.deals?.length * 60 || 100}px`,
              }}
            >
              <Popover placement="right-start" backdrop="opaque">
                <PopoverTrigger>
                  <button
                    title={resourceName}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap px-2 py-2 text-sm font-medium text-color02 bg-white"
                        style={{
                          transformOrigin: "center center",
                        }}
                      >
                        <p className="text-lg font-medium">
                          {truncateName(resourceName)}
                        </p>
                      </div>
                      <div className="absolute -bottom-[27px] left-0 flex w-full">
                        <div className="w-1/2 text-center text-[12px] bg-white border border-green-500 px-1 py-1">
                          {resourceData?.category?.slice(0, 3)}
                        </div>
                        <div
                          title={`Max Capacity ${resourceData?.totalMaxCapacity}%`}
                          className={`w-1/2 text-center text-[12px] px-1 py-1 text-white`}
                          style={{
                            backgroundColor: resourcesBgColor,

                            color: darken(0.6, resourcesBgColor),
                          }}
                        >
                          {resourcesForDeals[resourceName]
                            ?.totalCurrentTaskCapacity || 0}
                        </div>
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-transparent border-none rounded-none">
                  {() => (
                    <div className="relative">
                      <Image
                        src={backgroundSVG}
                        alt="Background"
                        objectFit="cover"
                        className="w-full h-full"
                      />
                      <div className="absolute top-0 left-0 w-full h-full px-1 overflow-auto pl-[50px] pt-5 ">
                        <div className="">
                          <h3 className="text-2xl font-semibold">
                            {resourceName}
                          </h3>
                          <p className="text-lg">{resourceData?.category}</p>

                          {resourcesForDeals[resourceName]?.dealDetails ? (
                            <div className="pt-2 space-y-2 ">
                              {resourcesForDeals[resourceName].dealDetails.map(
                                (deal, i) => {
                                  return (
                                    <>
                                      <div className="p-3 space-y-1" key={i}>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            Total Max Capacity
                                          </span>
                                          : {resourceData?.totalMaxCapacity}%
                                        </p>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            Deal ID:
                                          </span>
                                          {"   "}
                                          {deal["Deal ID"]}
                                        </p>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            Project:
                                          </span>
                                          {"   "}
                                          {deal["Project"]}
                                        </p>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            Deal Stage:
                                          </span>
                                          {"   "}
                                          {deal["Deal Stage"]}
                                        </p>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            Client:
                                          </span>
                                          {"   "}
                                          {deal["Client"]}
                                        </p>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            Start Date:
                                          </span>
                                          {"   "}
                                          {deal["Start Date"]}
                                        </p>
                                        <p className="text-medium">
                                          <span className="font-bold">
                                            End Date:
                                          </span>
                                          {"   "}
                                          {deal["End Date"]}
                                        </p>
                                      </div>
                                      <hr className="my-2 border-color5" />
                                    </>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            <div>No Deals</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ResourcesTimeLineSidebar;
