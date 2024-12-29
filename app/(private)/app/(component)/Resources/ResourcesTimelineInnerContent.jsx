import { getMondays, getMonthsRange } from "../../(utils)";
import { widthPerWeek } from "../Deals/AllDealItems";
import OverPointerShapes from "./OverPointerShapes";
import PointerShapes from "./PointerShapes";

function parseResourceDate(dateString) {
  if (dateString instanceof Date) {
    return dateString; // Return the Date object directly
  }

  if (typeof dateString !== "string") {
    return new Date(); // Return the current date as a fallback
  }

  const [day, month, year] = dateString.split(" ");

  // Ensure that month is parsed correctly
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  return new Date(parseInt(year, 10), monthIndex, parseInt(day, 10));
}

function ResourcesTimelineInnerContent({ resourcesData }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // get before 5 months and after 8 months from the current date
  const monthsRange = getMonthsRange(currentMonth, currentYear, 5, 8);

  const calculatePosition = (startDate, endDate, monthsRange) => {
    const startMonthIndex = monthsRange.findIndex(
      ({ month, year }) =>
        month === startDate.getMonth() && year === startDate.getFullYear()
    );
    const endMonthIndex = monthsRange.findIndex(
      ({ month, year }) =>
        month === endDate.getMonth() && year === endDate.getFullYear()
    );

    if (startMonthIndex === -1 || endMonthIndex === -1) {
      return { startX: 0, width: 0 };
    }

    const startDayIndex = Math.floor(
      (startDate - new Date(startDate.getFullYear(), startDate.getMonth(), 1)) /
        (1000 * 60 * 60 * 24 * 7)
    );
    const endDayIndex = Math.floor(
      (endDate - new Date(endDate.getFullYear(), endDate.getMonth(), 1)) /
        (1000 * 60 * 60 * 24 * 7)
    );

    const startX =
      monthsRange
        .slice(0, startMonthIndex)
        .reduce(
          (acc, { month, year }) => acc + getMondays(year, month).length,
          0
        ) *
        widthPerWeek +
      startDayIndex * widthPerWeek;

    const endX =
      monthsRange
        .slice(0, endMonthIndex)
        .reduce(
          (acc, { month, year }) => acc + getMondays(year, month).length,
          0
        ) *
        widthPerWeek +
      endDayIndex * widthPerWeek +
      widthPerWeek; // Adding extra day to include the end date fully

    return { startX, width: endX - startX };
  };

  function calculateResourcePosition(resourceData, monthsRange, widthPerWeek) {
    const availablePeriods = [];
    const overtaskedPeriods = [];
    const workingPeriods = [];

    const hiredDate = parseResourceDate(resourceData.dateHired);
    const timelineStartDate = new Date(
      monthsRange[0].year,
      monthsRange[0].month,
      1
    ); // Start of the timeline
    const sortedDeals = Object.values(resourceData.deals).sort(
      (a, b) => parseResourceDate(a.startDate) - parseResourceDate(b.startDate)
    );

    let lastEndDate =
      hiredDate < timelineStartDate ? timelineStartDate : hiredDate; // Ensure lastEndDate starts from the timeline if hired before the timeline
    let currentCapacity = 0;

    sortedDeals.forEach((deal) => {
      const startDate = parseResourceDate(deal.startDate);
      const endDate = parseResourceDate(deal.endDate);
      const dealCapacity = deal.dealCapacity;

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return; // Skip invalid dates
      }

      // Calculate the available period before this deal starts
      if (startDate > lastEndDate) {
        const { startX, width } = calculatePosition(
          lastEndDate,
          startDate,
          monthsRange
        );
        availablePeriods.push({
          startX,
          width,
          partial: false,
          remainingCapacity: resourceData.totalMaxCapacity, // Full capacity available
        });
      }

      // Update the current capacity with the current deal's capacity
      currentCapacity += dealCapacity;
      const remainingCapacityDuringDeal =
        resourceData.totalMaxCapacity - currentCapacity;

      // Add the current deal as a working period
      const { startX: workStartX, width: workWidth } = calculatePosition(
        startDate,
        endDate,
        monthsRange
      );
      workingPeriods.push({ startX: workStartX, width: workWidth });

      // Handle partial availability during the current deal
      if (remainingCapacityDuringDeal > 0) {
        availablePeriods.push({
          startX: workStartX,
          width: workWidth,
          partial: true,
          remainingCapacity: remainingCapacityDuringDeal,
        });
      }

      lastEndDate = endDate;
    });

    // Calculate any remaining available period after the last deal
    const timelineEndDate = new Date(
      monthsRange[monthsRange.length - 1].year,
      monthsRange[monthsRange.length - 1].month + 1,
      0
    );
    if (lastEndDate < timelineEndDate) {
      const { startX, width } = calculatePosition(
        lastEndDate,
        timelineEndDate,
        monthsRange
      );
      availablePeriods.push({
        startX,
        width,
        partial: false,
        remainingCapacity: resourceData.totalMaxCapacity, // Full capacity available
      });
    }

    // Calculate overtasked periods
    resourceData.overtaskPeriods.forEach((period) => {
      const startDate = parseResourceDate(period.overtaskStartDate);
      const endDate = parseResourceDate(period.overtaskEndDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return; // Skip invalid dates
      }

      const { startX, width } = calculatePosition(
        startDate,
        endDate,
        monthsRange
      );

      overtaskedPeriods.push({
        startX,
        width,
        overtaskedCapacity: period.overtaskedCapacity,
      });
    });

    return { availablePeriods, overtaskedPeriods, workingPeriods };
  }
  return (
    <div className="relative flex flex-col gap-[87px] pt-10">
      {Object.entries(resourcesData).map(([resourceName, resourceData], i) => {
        const { availablePeriods, overtaskedPeriods } =
          calculateResourcePosition(resourceData, monthsRange, widthPerWeek);
        return (
          <div
            key={i}
            className="relative px-5 py-4 bg-white border border-color5 flex flex-col justify-center h-[76px] w-[3050px]"
          >
            {/* Render available periods */}
            {availablePeriods.length > 0 &&
              availablePeriods.map(
                ({ startX, width, remainingCapacity }, periodIndex) => {
                  return (
                    <div
                      key={`available-${periodIndex}`}
                      style={{
                        position: "absolute",
                        left: `${startX}px`,
                        width: `${width}px`,
                      }}
                      className={`flex items-center justify-start my-2 text-[12px] relative `}
                    >
                      <div className="z-[45] bg-[#d2f2ff] border border-[#0199DB] py-1.5 px-2.5 relative">
                        {/* pointer shapes */}
                        <PointerShapes />
                        <span className="font-normal text-black border border-[#0199DB] bg-[#dff6ff] px-1.5">
                          {remainingCapacity}%
                        </span>

                        <span className="ml-2 font-medium capitalize text-color02">
                          {resourceName}
                        </span>
                      </div>
                      {/* available progress bar */}
                      <div className="w-full h-[9px] bg-[#0199DB] absolute z-40"></div>
                    </div>
                  );
                }
              )}
            {/* Render overtasked periods */}
            {overtaskedPeriods.length > 0 &&
              overtaskedPeriods.map(
                ({ startX, width, overtaskedCapacity }, periodIndex) => {
                  return (
                    <div
                      key={`overtasked-${periodIndex}`}
                      style={{
                        position: "absolute",
                        left: `${startX + 30}px`,
                        width: `${width - 50}px`,
                      }}
                      className="flex items-center justify-start my-2 text-[12px] font-semibold rounded-l-xl"
                    >
                      {overtaskedCapacity > 0 && (
                        <>
                          <div className="z-50 bg-[#FFD4D4] border border-[#FF0C0C] py-1.5 px-2.5 relative">
                            {/* pointer shapes */}
                            <OverPointerShapes />

                            <span className="font-normal text-black border border-[#FF0C0C] bg-[#FFD4D4] px-1.5">
                              {` ${overtaskedCapacity}%`}
                            </span>

                            <span className="ml-2 font-medium capitalize text-color02">
                              {resourceName}
                            </span>
                          </div>

                          {/* overtasked progress bar */}
                          <div className="absolute w-full h-[9px] bg-[#FF0C0C] animate-line-grow z-40"></div>
                        </>
                      )}
                    </div>
                  );
                }
              )}
          </div>
        );
      })}
    </div>
  );
}

export default ResourcesTimelineInnerContent;
