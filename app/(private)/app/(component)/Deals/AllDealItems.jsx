import Popover from "@/components/Popover";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import dynamic from "next/dynamic";
import { darken } from "polished";
import { useState } from "react";
import { getMonthsRange, parseDate } from "../../(utils)";
import { calculateDealsRow } from "../../(utils)/calculateDealsRow";
import DealPopoverContent from "./DealPopoverContent";

const DynamicAllocateResourceModal = dynamic(
  () => import("./AllocateResourceModal"),
  {
    ssr: false,
  }
);

export const widthPerWeek = 50; // Width per week in pixels

const AllDealItems = ({ dataByDealOwners, dealHeight, allResources }) => {
  const [isAllocateResourceModalOpen, setIsAllocateResourceModalOpen] =
    useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const { categoryColors = [] } = useCategoryColorKey();

  // get before 5 months and after 8 months from the current date
  const monthsRange = getMonthsRange(currentMonth, currentYear, 3, 8);

  const parseResourceDate = (dateString) => {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split(" ");
    return new Date(`${month} ${day}, ${year}`);
  };

  const getColor = (dealStage, border = false) => {
    const colorKey = categoryColors.find(
      (item) => item.name.toLowerCase() === dealStage.toLowerCase()
    );

    let baseColor = colorKey?.bgColor || "#d8d7dc";

    // If a border is required, adjust the color
    if (border) {
      baseColor = darken(0.2, baseColor); // Darkens the color by 20%
    }

    return baseColor;
  };

  const calculatePosition = (
    startDateString,
    endDateString,
    monthsRange,
    widthPerDay
  ) => {
    const startDate = parseResourceDate(startDateString);
    const endDate = parseResourceDate(endDateString);

    // Get the timeline's start and end dates
    const firstTimelineDate = new Date(
      monthsRange[0].year,
      monthsRange[0].month,
      1
    );
    const lastTimelineDate = new Date(
      monthsRange[monthsRange.length - 1].year,
      monthsRange[monthsRange.length - 1].month + 1,
      0
    );

    // Align the firstTimelineDate to the nearest previous Monday
    const timelineStartDay = firstTimelineDate.getDay();
    if (timelineStartDay !== 1) {
      firstTimelineDate.setDate(
        firstTimelineDate.getDate() - ((timelineStartDay + 6) % 7)
      );
    }

    // Ensure dates are within the timeline range
    let adjustedStartDate = startDate;
    let adjustedEndDate = endDate;

    if (startDate > lastTimelineDate) {
      adjustedStartDate = lastTimelineDate;
      adjustedEndDate = lastTimelineDate;
    } else {
      adjustedStartDate =
        startDate < firstTimelineDate ? firstTimelineDate : startDate;
      adjustedEndDate = endDate > lastTimelineDate ? lastTimelineDate : endDate;
    }

    // Calculate the number of days from the start of the timeline
    const daysFromTimelineStart = Math.floor(
      (adjustedStartDate - firstTimelineDate) / (1000 * 60 * 60 * 24)
    );

    const daysEndFromTimelineStart = Math.floor(
      (adjustedEndDate - firstTimelineDate) / (1000 * 60 * 60 * 24)
    );

    // Calculate X positions based on day offsets
    const startX = daysFromTimelineStart * widthPerDay;
    const width =
      (daysEndFromTimelineStart - daysFromTimelineStart + 1) * widthPerDay;

    // Force the startX to start from 50px(1 Week) to the left for adjust to the timeline grid view
    return { startX: startX - 50, width };
  };

  const truncateText = (text, width, font) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    let truncatedText = text;
    while (
      context.measureText(truncatedText).width > width &&
      truncatedText.length > 0
    ) {
      truncatedText = truncatedText.slice(0, -1);
    }
    return truncatedText + (truncatedText !== text ? "..." : "");
  };

  const calculateDealResourcesWidth = (resources) => {
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.visibility = "hidden";
    tempContainer.style.whiteSpace = "nowrap";
    document.body.appendChild(tempContainer);

    let totalWidth = 0;

    resources.forEach((resource) => {
      const resourceBox = document.createElement("span");
      resourceBox.style.padding = "12px";
      resourceBox.style.fontSize = "12px";
      resourceBox.style.border = `1px solid #ffcd29`;
      resourceBox.style.borderRight = "none";
      resourceBox.style.backgroundColor = "#ffcd29";
      resourceBox.textContent = resource.Resources;

      const capacityBox = 130;

      const combinedWidth =
        resourceBox.getBoundingClientRect().width + capacityBox;

      totalWidth += combinedWidth;

      tempContainer.appendChild(resourceBox);
      tempContainer.removeChild(resourceBox);
    });

    document.body.removeChild(tempContainer);

    return totalWidth;
  };

  return (
    <>
      {dataByDealOwners.map((owner, ownerIndex) => {
        const previousOwnersHeight = dataByDealOwners
          .slice(0, ownerIndex)
          .reduce((acc, prevOwner) => {
            const prevOwnerHeight =
              dataByDealOwners.length === 1
                ? 600
                : dataByDealOwners.length === 2
                ? 300
                : prevOwner.deals.length * dealHeight + 20;
            return acc + (prevOwnerHeight > 200 ? prevOwnerHeight : 200);
          }, 0);
        const dealsWithRow = owner.deals.map((deal, dealIndex, allDeals) => ({
          ...deal,
          row: calculateDealsRow(allDeals.slice(0, dealIndex), deal),
        }));

        return dealsWithRow.map((deal, dealIndex) => {
          // Collect all deal resources with their respective deal ID and capacity
          const dealResources = deal?.resources?.map((resource) => {
            // Find the correct deal capacity for this resource
            const dealId = deal["Deal ID"];
            let dealCapacity = null;
            // Loop through each deal ID and capacity field in the resource data
            for (let i = 1; i <= 4; i++) {
              // Assuming you have up to 4 deals per resource
              if (resource[`Deal ID ${i}`] === dealId) {
                dealCapacity = resource[`Deal Capacity ${i}(%)`];
                break;
              }
            }
            return {
              dealId,
              resourceName: resource.Resources,
              dealCapacity,
            };
          });
          const { startX, width } = calculatePosition(
            deal["Start Date"],
            deal["End Date"],
            monthsRange,
            widthPerWeek / 7
          );
          const topPosition = previousOwnersHeight + dealIndex * dealHeight;
          const isLastDeal =
            dealIndex === dealsWithRow.length - 1 && owner.overCapacity;

          const eightMonthsFromNow = new Date();
          eightMonthsFromNow.setMonth(eightMonthsFromNow.getMonth() + 8);

          const timelineStart = new Date(
            monthsRange[0].year,
            monthsRange[0].month,
            1
          );
          const timelineEnd = new Date(
            monthsRange[monthsRange.length - 1].year,
            monthsRange[monthsRange.length - 1].month + 1,
            0
          );
          const dealStartDate = parseDate(deal["Start Date"]);
          const dealEndDate = parseDate(deal["End Date"]);
          // Conditions for clipPath based on timeline start/end dates
          let clipPathValue =
            "polygon(0 0, 100% 0, calc(100% - 13px) 50%, 100% 100%, 0 100%)";

          if (dealStartDate < timelineStart && dealEndDate > timelineEnd) {
            clipPathValue = "polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%)"; // No start or end arrow
          }

          const font = "bold 12px Poppins"; // Same font as in the button
          const truncatedText = truncateText(
            `${deal.Client}: ${deal.Project}`,
            width - 30,
            font
          );

          const resourcesToShow = [];
          let accumulatedWidth = 0;

          // Determine how many resources can fit within the available width
          for (const resource of deal.resources) {
            const resourceWidth = calculateDealResourcesWidth(
              [resource],
              deal["Deal Stage"]
            );
            if (accumulatedWidth + resourceWidth > width) break;
            resourcesToShow.push(resource);
            accumulatedWidth += resourceWidth;
          }

          const remainingResourcesCount =
            deal.resources.length - resourcesToShow.length;

          return (
            <Popover
              key={`${ownerIndex}-${dealIndex}`}
              content={<DealPopoverContent deal={deal} />}
              isAllocateResourceModalOpen={isAllocateResourceModalOpen}
              onTriggerClick={() => setIsAllocateResourceModalOpen(true)} // Open the modal
            >
              <div
                style={{
                  position: "absolute",
                  left: `${startX}px`,
                  top: `${topPosition}px`,
                  width: `${width}px`,
                  height: `${dealHeight - 5}px`,
                  backgroundColor: isLastDeal
                    ? "rgba(255, 0, 0, 0.7)"
                    : getColor(deal["Deal Stage"]),
                  border: `1px dashed ${getColor(
                    deal["Deal Stage"],
                    "border"
                  )}`,
                  zIndex: 20,
                  borderRadius: "0px",
                  clipPath: clipPathValue,
                  // overflow: "hidden",
                  // whiteSpace: "nowrap",
                }}
                className="px-2 my-2 font-medium text-[13px] truncate shadow cursor-pointer"
              >
                {/* Deals name  */}
                {truncatedText}

                {/* Deals resources */}
                <div className="flex items-center w-full gap-1">
                  {resourcesToShow.map((resource, resourceIndex) => {
                    function getDealCountForResource(resource) {
                      return Object.keys(resource).filter((key) => {
                        return key.startsWith("Deal ID ") && resource[key];
                      }).length;
                    }

                    const dealCount = getDealCountForResource(resource);

                    // Find the correct deal capacity for this resource
                    const dealId = deal["Deal ID"];
                    let dealCapacity = null;
                    // Loop through each deal ID and capacity field in the resource data
                    for (let i = 1; i <= dealCount; i++) {
                      // Assuming you have up to 4 deals per resource
                      if (resource[`Deal ID ${i}`] === dealId) {
                        dealCapacity = resource[`Deal Capacity ${i}(%)`];
                        break;
                      }
                    }
                    return (
                      <div key={resourceIndex} className="z-50">
                        <div className="  min-w-fit h-full max-h-4 text-[12px]">
                          <p
                            style={{
                              border: `1px solid ${getColor(
                                deal["Deal Stage"],
                                "border"
                              )}`,
                              borderRight: "none",
                            }}
                            className=" bg-white px-1.5 capitalize inline"
                          >
                            {resource.Resources}
                          </p>

                          <p
                            style={{
                              border: `1px solid ${getColor(
                                deal["Deal Stage"],
                                "border"
                              )}`,
                            }}
                            className="  bg-white px-1.5 inline"
                          >
                            {dealCapacity}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {remainingResourcesCount > 0 && (
                    <span
                      style={{
                        backgroundColor: `${getColor(
                          deal["Deal Stage"],
                          "border"
                        )}`,
                      }}
                      className="flex items-center justify-center text-xs text-center text-white  rounded-full size-[22px] font-semibold"
                    >
                      +{remainingResourcesCount}
                    </span>
                  )}

                  <DynamicAllocateResourceModal
                    allResources={allResources}
                    dealId={deal["Deal ID"]}
                    projectName={deal.Project}
                    dealResources={dealResources}
                    deal={deal}
                    setIsAllocateResourceModalOpen={
                      setIsAllocateResourceModalOpen
                    }
                  />
                </div>
              </div>
            </Popover>
          );
        });
      })}
    </>
  );
};

export default AllDealItems;
