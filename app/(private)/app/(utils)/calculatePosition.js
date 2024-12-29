export const calculatePosition = (
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
        (acc, { month, year }) => acc + new Date(year, month + 1, 0).getDate(),
        0
      ) +
    adjustedStartDate.getDate() -
    1;

  // Calculate total days before the end month in the timeline
  const endDayPosition =
    monthsRange
      .slice(0, endMonthIndex)
      .reduce(
        (acc, { month, year }) => acc + new Date(year, month + 1, 0).getDate(),
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
