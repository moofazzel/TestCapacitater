"use client";
import { useEffect, useRef } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import { parseDate } from "../_utils";

import { MouseTracker } from "@/components/MousePointer";
import { useSyncHorizontalScroll } from "@/hooks/useSyncScroll";
import dynamic from "next/dynamic";
import Resources from "./Resources";
import StickyOwnerNames from "./StickyOwnerNames";
import StickyResourceName from "./StickyResourceName";

const DynamicAllocateResourceModal = dynamic(
  () => import("./AllocateResourceModal"),
  {
    ssr: false,
  }
);

function getMondays(year, month) {
  const mondays = [];
  const date = new Date(year, month, 1);

  // Adjust the date to the first Monday of the month
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  // Get all Mondays in the month
  while (date.getMonth() === month) {
    mondays.push(new Date(date.getTime()));
    date.setDate(date.getDate() + 7);
  }

  return mondays;
}

function getMonthsRange(currentMonth, currentYear, monthsBefore, monthsAfter) {
  const startMonth = currentMonth - monthsBefore;
  const endMonth = currentMonth + monthsAfter;
  const months = [];

  for (let i = startMonth; i <= endMonth; i++) {
    const date = new Date(currentYear, i);
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  return months;
}

function calculateRow(deals, currentDeal) {
  const currentStartDate = parseDate(currentDeal["Start Date"]);
  const currentEndDate = parseDate(currentDeal["End Date"]);

  let row = 0;

  while (true) {
    let isOverlap = false;

    for (let deal of deals) {
      if (deal.row !== row) continue;

      const startDate = parseDate(deal["Start Date"]);
      const endDate = parseDate(deal["End Date"]);

      if (
        (currentStartDate >= startDate && currentStartDate <= endDate) ||
        (currentEndDate >= startDate && currentEndDate <= endDate) ||
        (currentStartDate <= startDate && currentEndDate >= endDate)
      ) {
        isOverlap = true;
        row++;
        break;
      }
    }

    if (!isOverlap) break;
  }

  return row;
}

const getColor = (dealStage, border = false) => {
  let backgroundColor = {};

  switch (dealStage) {
    case "Closed Won":
      backgroundColor = { red: 0, green: 100, blue: 0 }; // Dark Green
      break;
    case "Registration":
      backgroundColor = { red: 144, green: 238, blue: 144 }; // Light Green
      break;
    case "Negotiation":
    case "Pitched":
      backgroundColor = { red: 255, green: 165, blue: 0 }; // Orange
      break;
    case "Pitching":
    case "Qualified":
      backgroundColor = { red: 255, green: 255, blue: 0 }; // Yellow
      break;
    default:
      backgroundColor = { red: 128, green: 0, blue: 128 }; // Purple for all others
  }

  const { red, green, blue } = backgroundColor;

  return border
    ? `rgba(${red}, ${green}, ${blue}, 1)` // Solid color with full opacity
    : `rgba(${red}, ${green}, ${blue}, 1)`; // Solid color with full opacity
};

export default function GridCalendar({
  dataByDealOwners,
  allResources,
  resourcesForDeals,
  resourcesData,
  totalResourcesLength,
}) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // get before 5 months and after 8 months from the current date
  const monthsRange = getMonthsRange(currentMonth, currentYear, 5, 8);

  const widthPerWeek = 50; // Width per week in pixels
  const containerRef = useRef(null);
  const containerWrapperRef = useRef(null);
  const resourcesRef = useRef(null);

  // Hook to sync scroll between the container and resources
  useSyncHorizontalScroll(containerRef, resourcesRef);

  useEffect(() => {
    const currentMonthIndex = monthsRange.findIndex(
      ({ month, year }) => month === currentMonth && year === currentYear
    );
    const previousMonthsWidth = monthsRange
      .slice(0, currentMonthIndex)
      .reduce((acc, { month, year }) => {
        return acc + getMondays(year, month).length * widthPerWeek;
      }, 0);
    const currentMonthMondays = getMondays(currentYear, currentMonth);
    const currentMondayIndex = currentMonthMondays.findIndex((monday) => {
      const nextMonday = new Date(monday);
      nextMonday.setDate(monday.getDate() + 7);
      return monday <= currentDate && currentDate < nextMonday;
    });

    const scrollToX =
      previousMonthsWidth +
      currentMondayIndex * widthPerWeek -
      window.innerWidth / 2.8 +
      widthPerWeek / 2;

    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: scrollToX,
        behavior: "smooth",
      });
    }
    if (resourcesRef.current) {
      resourcesRef.current.scrollTo({
        left: scrollToX,
        behavior: "smooth",
      });
    }

    const syncScroll = () => {
      if (resourcesRef.current) {
        resourcesRef.current.scrollLeft = containerRef.current.scrollLeft;
      }
    };

    const container = containerRef.current;
    container.addEventListener("scroll", syncScroll);

    return () => {
      container.removeEventListener("scroll", syncScroll);
    };
  }, [monthsRange, widthPerWeek, currentYear, currentMonth]);

  const parseResourceDate = (dateString) => {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split(" ");
    return new Date(`${month} ${day}, ${year}`);
  };

  const calculatePosition = (
    startDateString,
    endDateString,
    monthsRange,
    widthPerDay
  ) => {
    // Parse the date strings into Date objects
    const startDate = parseResourceDate(startDateString);
    const endDate = parseResourceDate(endDateString);

    // Calculate the first and last dates of the timeline
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

    let adjustedStartDate = startDate;
    let adjustedEndDate = endDate;

    // Adjust start and end dates based on the timeline boundaries
    if (startDate > lastTimelineDate) {
      adjustedStartDate = lastTimelineDate;
      adjustedEndDate = lastTimelineDate;
    } else {
      adjustedStartDate =
        startDate < firstTimelineDate ? firstTimelineDate : startDate;
      adjustedEndDate = endDate > lastTimelineDate ? lastTimelineDate : endDate;
    }

    // Calculate total days from the beginning of the timeline to the adjusted start date
    const startMonthIndex = monthsRange.findIndex(
      ({ month, year }) =>
        month === adjustedStartDate.getMonth() &&
        year === adjustedStartDate.getFullYear()
    );

    const endMonthIndex = monthsRange.findIndex(
      ({ month, year }) =>
        month === adjustedEndDate.getMonth() &&
        year === adjustedEndDate.getFullYear()
    );

    // If we can't find the start or end month in the timeline, return 0 values
    if (startMonthIndex === -1 || endMonthIndex === -1) {
      return { startX: 0, width: 0 };
    }

    // Calculate total days before the start month in the timeline
    const startDayPosition =
      monthsRange
        .slice(0, startMonthIndex)
        .reduce(
          (acc, { month, year }) =>
            acc + new Date(year, month + 1, 0).getDate(),
          0
        ) +
      adjustedStartDate.getDate() -
      1;

    // Calculate total days before the end month in the timeline
    const endDayPosition =
      monthsRange
        .slice(0, endMonthIndex)
        .reduce(
          (acc, { month, year }) =>
            acc + new Date(year, month + 1, 0).getDate(),
          0
        ) +
      adjustedEndDate.getDate() -
      1;

    // Calculate the start position in pixels
    const startX = startDayPosition * widthPerDay;

    // Calculate the width of the deal's duration in pixels
    const width = (endDayPosition - startDayPosition + 1) * widthPerDay;

    // Return the calculated start position and width
    return { startX, width };
  };

  const dealHeight = 40;

  const totalOwnerHeight =
    dataByDealOwners.length <= 2
      ? 600
      : dataByDealOwners.reduce((totalHeight, owner) => {
          // 20 extra for padding
          const ownerHeight = owner.deals.length * dealHeight + 20;

          return totalHeight + (ownerHeight > 200 ? ownerHeight : 200);
        }, 0);

  return (
    <>
      <div ref={containerWrapperRef} className="container relative mb-20 ">
        <div className="relative ">
          <MouseTracker
            containerWrapperRef={containerWrapperRef}
            containerRef={containerRef}
            resourcesRef={resourcesRef}
          />
          <div className="mouseTracker">
            <div
              ref={containerRef}
              className="max-w-full overflow-auto h-[60vh] scrollable-container"
            >
              {dataByDealOwners?.length > 0 ? (
                <>
                  <div className="relative w-max">
                    <div
                      style={{ height: `${totalOwnerHeight}px` }}
                      className="flex w-max"
                    >
                      <StickyOwnerNames
                        dataByDealOwners={dataByDealOwners}
                        dealHeight={dealHeight}
                      />
                      {/* timeline grid line */}
                      <div className="flex">
                        {monthsRange.map(({ month, year }, index) => {
                          const mondays = getMondays(year, month);
                          const monthWidth = mondays.length * widthPerWeek;
                          return (
                            <div
                              key={index}
                              style={{ width: `${monthWidth}px` }}
                              className="flex flex-col justify-end h-full "
                            >
                              <div className="relative flex justify-end h-full">
                                {mondays.map((monday, i) => {
                                  const nextMonday = new Date(monday);
                                  nextMonday.setDate(monday.getDate() + 7);
                                  const isCurrentWeek =
                                    monday <= currentDate &&
                                    currentDate < nextMonday;

                                  const dayOfWeek = currentDate.getDay();

                                  const dayNumber = ((dayOfWeek + 6) % 7) + 1;

                                  // Width of each day in the calendar
                                  const dayWidth = widthPerWeek / 7;

                                  // Calculate the position of the current day in pixels (minus one to make Monday start at 0px)
                                  const currentDayPosition =
                                    (dayNumber - 1) * dayWidth;
                                  return (
                                    <div
                                      key={i}
                                      style={{ width: `${widthPerWeek}px` }}
                                      className={`text-center  border relative h-full flex items-end justify-center`}
                                    >
                                      {isCurrentWeek && (
                                        <div
                                          style={{
                                            width: "2px",
                                            left: `${currentDayPosition}px`,
                                          }}
                                          className="absolute bottom-0 z-20 w-1 h-full bg-red-500 left-1"
                                        ></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Render Deal Boxes */}
                      {dataByDealOwners.map((owner, ownerIndex) => {
                        // Calculate the top position for the first deal of the current owner
                        const previousOwnersHeight = dataByDealOwners
                          .slice(0, ownerIndex)
                          .reduce((acc, prevOwner) => {
                            const prevOwnerHeight =
                              dataByDealOwners.length === 1
                                ? 600
                                : dataByDealOwners.length === 2
                                ? 300
                                : prevOwner.deals.length * dealHeight + 20;
                            return (
                              acc +
                              (prevOwnerHeight > 200 ? prevOwnerHeight : 200)
                            );
                          }, 0);
                        const dealsWithRow = owner.deals.map(
                          (deal, dealIndex, allDeals) => ({
                            ...deal,
                            row: calculateRow(
                              allDeals.slice(0, dealIndex),
                              deal
                            ),
                          })
                        );
                        return dealsWithRow.map((deal, dealIndex) => {
                          // Collect all deal resources with their respective deal ID and capacity
                          const dealResources = deal?.resources?.map(
                            (resource) => {
                              // Find the correct deal capacity for this resource
                              const dealId = deal["Deal ID"];
                              let dealCapacity = null;
                              // Loop through each deal ID and capacity field in the resource data
                              for (let i = 1; i <= 4; i++) {
                                // Assuming you have up to 4 deals per resource
                                if (resource[`Deal ID ${i}`] === dealId) {
                                  dealCapacity =
                                    resource[`Deal Capacity ${i}(%)`];
                                  break;
                                }
                              }
                              return {
                                dealId,
                                resourceName: resource.Resources,
                                dealCapacity,
                              };
                            }
                          );
                          const { startX, width } = calculatePosition(
                            deal["Start Date"],
                            deal["End Date"],
                            monthsRange,
                            widthPerWeek / 7
                          );
                          // Calculate the top position for the deal box within the accumulated owner heights
                          const topPosition =
                            previousOwnersHeight + dealIndex * dealHeight;
                          const eightMonthsFromNow = new Date();
                          eightMonthsFromNow.setMonth(
                            eightMonthsFromNow.getMonth() + 8
                          );
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
                            "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%)";
                          if (
                            dealStartDate < timelineStart &&
                            dealEndDate > timelineEnd
                          ) {
                            clipPathValue =
                              "polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%)"; // No start or end arrow
                          } else if (
                            dealStartDate < timelineStart &&
                            dealEndDate <= timelineEnd
                          ) {
                            clipPathValue =
                              "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%)"; // No start arrow
                          } else if (
                            dealStartDate >= timelineStart &&
                            dealEndDate > timelineEnd
                          ) {
                            clipPathValue =
                              // "polygon(13px 0, 100% 0, 100% 50%, 100% 100%, 13px 100%, 0 50%)"; // No end arrow
                              "polygon(0 0, calc(100% - 0px) 0, 100% 50%, calc(100% - 0px) 100%, 0 100%, 13px 50%)"; // No end arrow
                          }
                          // Check if this is the last deal and if the resource is over-tasked
                          const isLastDeal =
                            dealIndex === dealsWithRow.length - 1 &&
                            owner.overCapacity;
                          // const eachOwnerHeight = owner.deals.length * dealHeight;
                          // const ownerHeight =
                          //   eachOwnerHeight > 200 ? eachOwnerHeight : 200;

                          const notStartArrow = dealStartDate < timelineStart;
                          return (
                            <Tooltip
                              showArrow={true}
                              delay={1500}
                              closeDelay={10}
                              color="primary"
                              placement="top-start"
                              content={
                                <div className="p-1 ">
                                  <b>Project:</b> {deal["Project"]}+
                                  <br />
                                  <b>Client:</b> {deal["Client"]}
                                  <br />
                                  <b>Start Date:</b> {deal["Start Date"]}
                                  <br />
                                  <span
                                  // className={
                                  //   eightMonthsFromNow < parseDate(deal["End Date"])
                                  //     ? "text-red-500 animate-pulse"
                                  //     : ""
                                  // }
                                  >
                                    <b> End Date: </b>
                                    {deal["End Date"]}
                                  </span>
                                  <br />
                                  <b> Deal Stage:</b> {deal["Deal Stage"]}
                                </div>
                              }
                              key={`${ownerIndex}-${dealIndex}`}
                            >
                              <Button
                                as={"div"}
                                style={{
                                  position: "absolute",
                                  left: `${startX}px`,
                                  top: `${topPosition}px`,
                                  width: `${width}px`,
                                  height: `${dealHeight - 5}px`,
                                  backgroundColor: isLastDeal
                                    ? "rgba(255, 0, 0, 0.7)" // Red color for over-tasked deals
                                    : getColor(deal["Deal Stage"]),
                                  border: `2px solid ${getColor(
                                    deal["Deal Stage"],
                                    "border"
                                  )}`,
                                  zIndex: 20,
                                  borderRadius: "5px",
                                  clipPath: clipPathValue,
                                }}
                                className="flex items-center justify-center my-2 text-[12px] px-2 font-semibold relative w-max"
                              >
                                <div
                                  className={` ${
                                    notStartArrow ? "ml-8" : ""
                                  } flex items-center gap-1 w-full`}
                                >
                                  {deal.resources.map(
                                    (resource, resourceIndex) => {
                                      // Find the correct deal capacity for this resource
                                      const dealId = deal["Deal ID"];
                                      let dealCapacity = null;
                                      // Loop through each deal ID and capacity field in the resource data
                                      for (let i = 1; i <= 4; i++) {
                                        // Assuming you have up to 4 deals per resource
                                        if (
                                          resource[`Deal ID ${i}`] === dealId
                                        ) {
                                          dealCapacity =
                                            resource[`Deal Capacity ${i}(%)`];
                                          break;
                                        }
                                      }
                                      return (
                                        <div
                                          key={resourceIndex}
                                          className="z-50"
                                        >
                                          <div className="bg-[#ffcd29] px-3 min-w-fit h-full max-h-5 flex items-center justify-center rounded-xl text-[10px] border-2 border-[#ebab00] relative">
                                            {resource.Resources}
                                            <small className="bg-[#e4ccff] px-1 rounded-[4px] font-light text-[7px] absolute -top-[5px] left-0">
                                              {dealCapacity}
                                            </small>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}

                                  <DynamicAllocateResourceModal
                                    allResources={allResources}
                                    dealId={deal["Deal ID"]}
                                    projectName={deal.Project}
                                    dealResources={dealResources}
                                    // isOpen={isOpen}
                                    // setIsOpen={setIsOpen}
                                  />
                                </div>
                                <div className="absolute">{`${deal.Client}: ${deal.Project}`}</div>
                              </Button>
                            </Tooltip>
                          );
                        });
                      })}
                    </div>
                    {/* Days and month */}
                    <div className="sticky bottom-0 z-30 flex w-max">
                      {monthsRange.map(({ month, year }, index) => {
                        const mondays = getMondays(year, month);
                        const monthWidth = mondays.length * widthPerWeek;
                        return (
                          <div
                            key={index}
                            style={{ width: `${monthWidth}px` }}
                            className="flex flex-col justify-end "
                          >
                            <div className="relative flex justify-end">
                              {mondays.map((monday, i) => {
                                const nextMonday = new Date(monday);
                                nextMonday.setDate(monday.getDate() + 7);
                                const isCurrentWeek =
                                  monday <= currentDate &&
                                  currentDate < nextMonday;
                                return (
                                  <div
                                    key={i}
                                    style={{ width: `${widthPerWeek}px` }}
                                    className={`border border-slate-300 bg-slate-200  relative h-full flex items-end`}
                                  >
                                    <span className="-ml-2.5 flex justify-center text-center w-5 bg-[#a5a29926] px-1 rounded ">
                                      {" "}
                                      {monday.getDate()}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="font-bold text-center border bg-slate-200 border-slate-300">
                              {`${new Date(year, month).toLocaleString(
                                "default",
                                {
                                  month: "short",
                                }
                              )} ${year}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[600px] ">
                  <div className="text-xl font-bold text-center">
                    <p>No deals found</p>
                    <small>
                      Please add or import deals to your Google Sheet to get
                      started.
                    </small>
                  </div>
                </div>
              )}
            </div>
            {/* Resources section */}
            <div
              ref={resourcesRef}
              className="max-w-full overflow-auto border max-h-[32vh] resources scrollable-container"
            >
              <Resources
                widthPerWeek={widthPerWeek}
                resourcesData={resourcesData}
                monthsRange={monthsRange}
                getMondays={getMondays}
                widthPerDay={widthPerWeek}
                currentDate={currentDate}
                totalResourcesLength={totalResourcesLength}
              />
              {/* sticky Resources name*/}
              <StickyResourceName resourcesData={resourcesData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
