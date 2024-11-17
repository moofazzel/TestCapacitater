import { parseResourceDate } from "../_utils";

const Resources = ({
  widthPerWeek,
  monthsRange,
  getMondays,
  widthPerDay,
  currentDate,
  resourcesData,
  totalResourcesLength,
}) => {
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
        widthPerDay +
      startDayIndex * widthPerDay;

    const endX =
      monthsRange
        .slice(0, endMonthIndex)
        .reduce(
          (acc, { month, year }) => acc + getMondays(year, month).length,
          0
        ) *
        widthPerDay +
      endDayIndex * widthPerDay +
      widthPerDay; // Adding extra day to include the end date fully

    return { startX, width: endX - startX };
  };

  function calculateResourcePosition(resourceData, monthsRange, widthPerDay) {
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
    <>
      {totalResourcesLength > 0 ? (
        <div className="relative ">
          <div className="absolute top-0 left-0 z-40 flex w-max">
            {/* Calendar grid */}
            {monthsRange.map(({ month, year }, index) => {
              const mondays = getMondays(year, month);
              // const monthWidth = mondays.length * widthPerDay;
              return (
                <div key={index} className="flex flex-col justify-end h-full">
                  <div
                    style={{
                      height: `${totalResourcesLength * 36}px`,
                    }}
                    className="relative flex justify-end "
                  >
                    {mondays.map((monday, i) => {
                      const nextMonday = new Date(monday);
                      nextMonday.setDate(monday.getDate() + 7);

                      const isCurrentWeek =
                        monday <= currentDate && currentDate < nextMonday;

                      const dayOfWeek = currentDate.getDay();

                      const dayNumber = ((dayOfWeek + 6) % 7) + 1;

                      // Width of each day in the calendar
                      const dayWidth = widthPerWeek / 7;

                      // Calculate the position of the current day in pixels (minus one to make Monday start at 0px)
                      const currentDayPosition = (dayNumber - 1) * dayWidth;
                      return (
                        <div
                          key={i}
                          style={{ width: `${widthPerDay}px` }}
                          className={`text-center border relative h-full flex items-end justify-center`}
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

          <div className="relative w-fullf w-max">
            {/* Resources name and row */}
            <div className="absolute top-0 left-0 flex flex-col h-full gap-3 w-max">
              {Object.entries(resourcesData).map(
                ([resourceName, resourceData], i) => {
                  const { availablePeriods, overtaskedPeriods } =
                    calculateResourcePosition(
                      resourceData,
                      monthsRange,
                      widthPerDay
                    );
                  return (
                    <div key={i} className="z-40 flex flex-row items-center">
                      {/* Render the resource name only */}
                      <div className="invisible  min-w-fit  px-5 h-full max-h-6 flex items-center justify-center rounded-xl text-xs border-2 border-[#ebab00] bg-[#ebab00] font-bold">
                        {resourceName}
                      </div>
                      {/* Render available periods */}
                      {availablePeriods.length > 0 &&
                        availablePeriods.map(
                          (
                            { startX, width, remainingCapacity },
                            periodIndex
                          ) => {
                            return (
                              <div
                                key={`available-${periodIndex}`}
                                style={{
                                  position: "absolute",
                                  left: `${startX}px`,
                                  width: `${width}px`,
                                  zIndex: 20,
                                }}
                                className={`flex items-center justify-start my-2 text-[12px] rounded-l-xl relative font-normal
                              }`}
                              >
                                <span className="rounded-xl text-xs border-2 border-[#ebab00]  bg-[#ebab00] py-[2px] absolute left-0 z-40">
                                  {resourceName}
                                  <small className="bg-[#e4ccff] px-1 py-0 rounded-[4px] font-light text-[7px] absolute -top-[10px] left-0 ">
                                    {` ${remainingCapacity}%`}
                                  </small>
                                </span>
                                <div className="w-full h-1 bg-[#ebab00] absolute"></div>
                              </div>
                            );
                          }
                        )}
                      {/* Render overtasked periods */}
                      {overtaskedPeriods.length > 0 &&
                        overtaskedPeriods.map(
                          (
                            { startX, width, overtaskedCapacity },
                            periodIndex
                          ) => {
                            return (
                              <div
                                key={`overtasked-${periodIndex}`}
                                style={{
                                  position: "absolute",
                                  left: `${startX + 30}px`,
                                  width: `${width - 50}px`,
                                  zIndex: 20,
                                }}
                                className="flex items-center justify-start my-2 text-[12px] font-semibold rounded-l-xl"
                              >
                                {overtaskedCapacity > 0 && (
                                  <>
                                    {" "}
                                    <div className="absolute w-full h-1 bg-red-500 animate-line-grow"></div>
                                    <div className="relative font-normal">
                                      <span className="rounded-xl text-xs border-2 border-red-500 bg-red-500 py-[2px]">
                                        {resourceName} (Overtasked)
                                        <small className="bg-red-500 text-white px-1 py-0 rounded-[4px] font-light text-[7px] absolute -top-[10px] left-0 ">
                                          {` ${overtaskedCapacity}%`}
                                        </small>
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          }
                        )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full py-5 text-lg ">
          <p>No resources found</p>
        </div>
      )}
    </>
  );
};

export default Resources;
