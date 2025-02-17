"use client";

import backgroundSVG from "@/public/resourceShape.png";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Image from "next/image";

// Utility function to truncate names
const truncateFirstName = (name) => {
  const acceptableLength = 7;
  const [firstName] = name.split(" ");
  return {
    name:
      firstName?.length > acceptableLength
        ? `${firstName.slice(0, acceptableLength)}...`
        : firstName,
  };
};

function getCapacityColor(usedCapacity, totalCapacity) {
  if (totalCapacity === 0) {
    // Edge case: No capacity defined, treat as yellow
    return "yellow";
  }

  // Calculate thresholds
  const yellowThreshold = 0.85 * totalCapacity; // 85% of total capacity
  const greenThreshold = totalCapacity; // 100% of total capacity

  // Determine color based on used capacity
  if (usedCapacity <= yellowThreshold) {
    return "yellow"; // Yellow: < 85%
  } else if (usedCapacity > yellowThreshold && usedCapacity <= greenThreshold) {
    return "green"; // Green: 85–100%
  } else {
    return "red"; // Red: > 100%
  }
}

const ResourcesTimeLineSidebar = ({
  resourcesData,
  resourcesForDeals,
  isHoveredRow,
  setIsHoveredRow,
}) => {
  return (
    <div className="relative flex flex-col items-stretch w-full gap-[15px] pt-4">
      {Object.entries(resourcesData).map(
        ([resourceName, resourceData], index) => {
          const resourcesBgColor = getCapacityColor(
            resourcesForDeals[resourceName]?.totalCurrentTaskCapacity || 0,
            resourceData?.totalMaxCapacity || 0
          );
          const { name: truncatedName } = truncateFirstName(resourceName);

          return (
            <div
              key={index}
              className="flex relative justify-center items-center bg-gray-50 border border-color5"
              style={{
                height: `40px`,
              }}
            >
              <Popover placement="right-start" backdrop="opaque">
                <PopoverTrigger>
                  <button
                    className={` ${
                      isHoveredRow === resourceName ? "bg-color9" : ""
                    } relative w-full text-center h-full transition-all duration-300 ease-in-out`}
                    onMouseEnter={() => setIsHoveredRow(resourceName)}
                    onMouseLeave={() => setIsHoveredRow(null)}
                  >
                    <p title={resourceName} className={`text-xs font-medium`}>
                      {truncatedName}
                    </p>
                    <p
                      title={resourceData?.category}
                      className={`font-normal text-[9px]`}
                    >
                      {resourceData?.category?.length > 10
                        ? `${resourceData?.category.slice(0, 10)}...`
                        : resourceData?.category}
                    </p>

                    {/* resource capacity */}

                    {/* <span
                      className="absolute -top-1 right-0 size-3 text-[10px] "
                      style={{
                        backgroundColor: resourcesBgColor,

                        color: darken(0.6, resourcesBgColor),
                      }}
                    >
                      {resourcesForDeals[resourceName]
                        ?.totalCurrentTaskCapacity || 0}
                    </span> */}

                    {/* <div className="flex flex-col items-center">
                      <div className="absolute -bottom-[27px] left-0 flex w-full">
                        <div
                          className="w-1/2 text-center text-[12px] border border-green-500 px-1 py-1"
                          title={resourceData?.category}
                        >
                          {resourceData?.category?.slice(0, 3)}
                        </div>
                        <div
                          title={`${
                            resourcesForDeals[resourceName]
                              ?.totalCurrentTaskCapacity || 0
                          }% capacity tasked at this time`}
                          className={`px-1 py-1 w-1/2 text-center text-white text-[12px]`}
                          style={{
                            backgroundColor: resourcesBgColor,

                            color: darken(0.6, resourcesBgColor),
                          }}
                        >
                          {resourcesForDeals[resourceName]
                            ?.totalCurrentTaskCapacity || 0}
                        </div>
                      </div>
                    </div> */}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 bg-transparent rounded-none border-none"
                  style={{
                    maxWidth: "300px",
                    overflow: "hidden",
                  }}
                >
                  {() => (
                    <div className="relative">
                      <Image
                        src={backgroundSVG}
                        alt="Background"
                        objectFit="cover"
                        className="w-full h-full"
                      />
                      <div className="absolute top-0 left-0 w-full h-full px-1 overflow-auto pl-[35px] pr-[10px] pt-[1px] pb-5">
                        <div>
                          <div className="flex sticky top-0 z-10 justify-around items-center bg-white">
                            <h3 className="pb-2 text-2xl font-semibold border-b-2 border-color5">
                              {resourceName}
                            </h3>
                            <p className="pb-2 text-lg border-b-2 border-color5">
                              {resourceData?.category}
                            </p>
                          </div>

                          {resourcesForDeals[resourceName]?.dealDetails ? (
                            <div className="pt-2 space-y-2">
                              {resourcesForDeals[resourceName].dealDetails.map(
                                (deal, i) => {
                                  const findDealCapacity = (
                                    resources,
                                    dealId
                                  ) => {
                                    if (!resources || resources.length === 0) {
                                      console.log(
                                        "No resources found for deal:",
                                        dealId
                                      );
                                      return "N/A";
                                    }

                                    for (let resource of resources) {
                                      // Dynamically get all keys for Deal IDs
                                      const dealKeys = Object.keys(
                                        resource
                                      ).filter((key) =>
                                        key.startsWith("Deal ID")
                                      );

                                      for (let key of dealKeys) {
                                        const capacityKey =
                                          key.replace(
                                            "Deal ID",
                                            "Deal Capacity"
                                          ) + "(%)";
                                        if (resource[key] === dealId) {
                                          return resource[capacityKey] || "N/A";
                                        }
                                      }
                                    }
                                    return "N/A";
                                  };
                                  const dealCapacity = findDealCapacity(
                                    deal.resources,
                                    deal["Deal ID"]
                                  );
                                  function formatDate(dateString) {
                                    const date = new Date(dateString);
                                    const options = {
                                      day: "2-digit",
                                      month: "short",
                                      year: "2-digit",
                                    };
                                    return date
                                      .toLocaleDateString("en-GB", options)
                                      .replace(",", "");
                                  }
                                  return (
                                    <>
                                      <div
                                        className="flex flex-col justify-center items-center space-y-4"
                                        key={i}
                                      >
                                        {/* Project Name */}
                                        <div className="mt-4 w-full text-center">
                                          <p className="text-lg font-semibold text-gray-700">
                                            <span className="text-color5">
                                              Project:
                                            </span>
                                            &nbsp;{deal["Project"]}
                                          </p>
                                        </div>

                                        {/* Capacity and Deal Stage */}
                                        <div className="flex flex-wrap justify-center items-center p-2 space-x-4 w-full bg-gray-50 rounded-md border border-color5">
                                          <p className="text-sm text-gray-600">
                                            <span className="font-medium text-color5">
                                              Capacity Used:
                                            </span>
                                            &nbsp;
                                            {dealCapacity}%
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            <span className="font-medium text-color5">
                                              Deal Stage:
                                            </span>
                                            &nbsp;
                                            {deal["Deal Stage"]}
                                          </p>
                                        </div>

                                        {/* Project Timeline */}
                                        <div className="p-2 w-full text-center bg-gray-50 rounded-md border border-color5">
                                          <p className="text-sm text-gray-600">
                                            <span className="font-medium text-color5">
                                              Project Timeline:
                                            </span>
                                            &nbsp;
                                            {formatDate(
                                              deal["Start Date"]
                                            )} - {formatDate(deal["End Date"])}
                                          </p>
                                        </div>

                                        {/* Deal ID and Client */}
                                        <div className="flex flex-wrap justify-center items-center p-2 space-x-4 w-full bg-gray-50 rounded-md border border-color5">
                                          <p className="text-sm text-gray-600">
                                            <span className="font-medium text-color5">
                                              Deal ID:
                                            </span>
                                            &nbsp;
                                            {deal["Deal ID"]}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            <span className="font-medium text-color5">
                                              Client:
                                            </span>
                                            &nbsp;
                                            {deal["Client"]}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="py-5 border-b border-color5"></div>
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
