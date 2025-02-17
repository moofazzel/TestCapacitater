import { getMonthsRange } from "../../(utils)";
import { widthPerWeek } from "../Deals/AllDealItems";
import CapacityIndicator from "./CapacityIndicator";

/**
 * Safely parse a date string in "day month year" format into a Date.
 * If invalid or missing, returns a min or max sentinel date as fallback.
 */
function parseResourceDate(dateString) {
  if (dateString instanceof Date) {
    return dateString;
  }
  if (typeof dateString !== "string") {
    // fallback => you could also do return new Date("9999-12-31");
    return new Date("1900-01-01");
  }

  // Expecting something like "4 March 2024"
  const parts = dateString.trim().split(" ");
  if (parts.length === 3) {
    const [dayStr, monthStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    // Convert "March" => month index
    const tempDate = new Date(`${monthStr} 1, 2000`);
    if (!isNaN(tempDate.getTime())) {
      const monthIndex = tempDate.getMonth(); // 0-based
      return new Date(year, monthIndex, day);
    }
  }

  // If we got here, fallback to a sentinel
  return new Date("1900-01-01");
}

/**
 * Align timeline start date to the nearest previous Monday.
 * This helps calculate the day-based offset more precisely.
 */
function alignToPreviousMonday(date) {
  const aligned = new Date(date);
  const day = aligned.getDay();
  if (day !== 1) {
    // day=0 => Sunday, day=1 => Monday, day=2 => Tuesday, etc.
    // Move 'aligned' back to Monday
    // We use (day + 6) % 7 so Monday => 1 => shift by 0
    aligned.setDate(aligned.getDate() - ((day + 6) % 7));
  }
  return aligned;
}

/**
 * Given an actual start and end date,
 * compute the 'startX' and 'width' on the timeline.
 */
function calculatePosition(startDate, endDate, timelineStartDate) {
  // how many days from the timeline's (aligned) start date
  const daysFromTimelineStart = Math.floor(
    (startDate - timelineStartDate) / (1000 * 60 * 60 * 24)
  );
  const startX =
    Math.floor(daysFromTimelineStart / 7) * widthPerWeek +
    ((daysFromTimelineStart % 7) * widthPerWeek) / 7;

  const daysEndFromTimelineStart = Math.floor(
    (endDate - timelineStartDate) / (1000 * 60 * 60 * 24)
  );
  const endX =
    Math.floor(daysEndFromTimelineStart / 7) * widthPerWeek +
    ((daysEndFromTimelineStart % 7) * widthPerWeek) / 7 +
    widthPerWeek / 7; // small extra to include that last day

  const width = endX - startX;
  // The user’s existing code subtracts 50px from startX for visual shift
  return { startX: startX - 50, width };
}

/**
 * Build sub-interval-based "periods" for a single resource:
 *  - Breaks the timeline into slices determined by unique deal boundaries.
 *  - Ensures there's an "available" chunk before the first deal starts.
 *  - Sums capacity usage for intervals overlapping each sub-interval.
 *  - Marks periods as "available", "working", or "overtask".
 */
function buildResourcePeriods(resourceData, monthsRange) {
  // Overall timeline boundaries from your getMonthsRange call
  const timelineStartDate = new Date(
    monthsRange[0].year,
    monthsRange[0].month,
    1
  );
  const timelineEndDate = new Date(
    monthsRange[monthsRange.length - 1].year,
    monthsRange[monthsRange.length - 1].month + 1,
    0
  );

  // Align the timeline start to Monday (like your code in calculatePosition)
  const alignedTimelineStart = alignToPreviousMonday(timelineStartDate);

  // If no deals exist, one big "available" chunk
  const dealEntries = Object.values(resourceData.deals || {});
  if (dealEntries.length === 0) {
    const { startX, width } = calculatePosition(
      alignedTimelineStart,
      timelineEndDate,
      alignedTimelineStart
    );
    return [
      {
        startX,
        width,
        type: "available",
        usedCapacity: 0,
        remainingCapacity: resourceData.totalMaxCapacity,
        startDate: alignedTimelineStart,
        endDate: timelineEndDate,
      },
    ];
  }

  // 1) Gather intervals from each deal
  //    Clip deals to stay within [alignedTimelineStart, timelineEndDate].
  const intervals = [];
  dealEntries.forEach((deal) => {
    const s = parseResourceDate(deal.startDate);
    const e = parseResourceDate(deal.endDate);

    // Clip to timeline
    const start = s < alignedTimelineStart ? alignedTimelineStart : s;
    const end = e > timelineEndDate ? timelineEndDate : e;

    if (start < end) {
      intervals.push({
        start,
        end,
        capacity: deal.dealCapacity || 0,
      });
    }
  });

  // If all deals are out of the timeline range, return one "available" chunk
  if (intervals.length === 0) {
    const { startX, width } = calculatePosition(
      alignedTimelineStart,
      timelineEndDate,
      alignedTimelineStart
    );
    return [
      {
        startX,
        width,
        type: "available",
        usedCapacity: 0,
        remainingCapacity: resourceData.totalMaxCapacity,
        startDate: alignedTimelineStart,
        endDate: timelineEndDate,
      },
    ];
  }

  // 2) Insert a zero-capacity interval if there's a gap BEFORE the earliest deal
  //    so we get an "available" slice before the first deal starts.
  const earliestDealStart = intervals.reduce(
    (earliest, iv) => (iv.start < earliest ? iv.start : earliest),
    timelineEndDate
  );

  // Optional: also consider the resource's hired date
  const resourceHired = parseResourceDate(resourceData.dateHired);
  // We take the later of (aligned timeline start) and (resource hired date)
  // as the actual "resource timeline start".
  const resourceTimelineStart =
    resourceHired > alignedTimelineStart ? resourceHired : alignedTimelineStart;

  if (earliestDealStart > resourceTimelineStart) {
    // Add a zero-capacity interval from resourceTimelineStart -> earliestDealStart
    intervals.push({
      start: resourceTimelineStart,
      end: earliestDealStart,
      capacity: 0, // "available"
    });
  }

  // 3) Collect unique boundaries from all intervals
  const boundaries = new Set();
  intervals.forEach((iv) => {
    boundaries.add(iv.start.getTime());
    boundaries.add(iv.end.getTime());
  });
  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

  // 4) For each adjacent pair of boundaries, sum up intervals that cover that entire sub-interval
  const periods = [];
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const subStart = new Date(sortedBoundaries[i]);
    const subEnd = new Date(sortedBoundaries[i + 1]);

    // Find intervals that fully overlap [subStart, subEnd)
    const active = intervals.filter(
      (iv) => iv.start <= subStart && iv.end >= subEnd
    );
    const totalUsed = active.reduce((acc, iv) => acc + iv.capacity, 0);
    const overtask = Math.max(0, totalUsed - resourceData.totalMaxCapacity);

    let periodType = "working";
    if (totalUsed === 0) {
      periodType = "available";
    } else if (overtask > 0) {
      periodType = "overtask";
    }

    const { startX, width } = calculatePosition(
      subStart,
      subEnd,
      alignedTimelineStart
    );

    periods.push({
      startX,
      width,
      type: periodType,
      usedCapacity: totalUsed,
      remainingCapacity: Math.max(resourceData.totalMaxCapacity - totalUsed, 0),
      startDate: subStart,
      endDate: subEnd,
    });
  }

  return periods;
}

function ResourcesTimelineInnerContent({
  resourcesData,
  isHoveredRow,
  setIsHoveredRow,
}) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get months from 5 months before now to 8 months after
  const monthsRange = getMonthsRange(currentMonth, currentYear, 3, 8);

  return (
    <div className="relative flex flex-col gap-[15px]">
      {Object.entries(resourcesData).map(([resourceName, resourceData], i) => {
        const periods = buildResourcePeriods(resourceData, monthsRange);

        return (
          <div
            key={i}
            className={`transition-all duration-300 ease-in-out relative px-5 bg-white border border-color5 flex flex-col justify-center h-[40px] w-[3050px] cursor-default ${
              isHoveredRow === resourceName ? "!bg-color9" : ""
            }`}
            onMouseEnter={() => setIsHoveredRow(resourceName)}
            onMouseLeave={() => setIsHoveredRow(null)}
          >
            {/* Render each sub-interval as a colored bar */}
            {periods.map(({ startX, width, usedCapacity }, periodIndex) => (
              <CapacityIndicator
                key={periodIndex}
                startX={startX}
                width={width}
                usedCapacity={usedCapacity}
                periodIndex={periodIndex}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default ResourcesTimelineInnerContent;
