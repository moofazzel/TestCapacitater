import { widthPerWeek } from "@/app/(private)/app/(component)/Deals/AllDealItems";
import { getMondays, getMonthsRange } from "@/app/(private)/app/(utils)";
import { useEffect } from "react";

//  Hook to sync scrolling and calculate current month's position
export const useScrollToCurrentDate = (containerRef, resourcesRef) => {
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get months range (5 months before and 8 months after the current month)
    const monthsRange = getMonthsRange(currentMonth, currentYear, 3, 8);

    // Find the index of the current month in monthsRange
    const currentMonthIndex = monthsRange.findIndex(
      ({ month, year }) => month === currentMonth && year === currentYear
    );

    // Calculate the width of all months up to the current month
    const previousMonthsWidth = monthsRange
      .slice(0, currentMonthIndex)
      .reduce((acc, { month, year }) => {
        return acc + getMondays(year, month).length * widthPerWeek;
      }, 0);

    // Get all Mondays of the current month and find the current week index
    const currentMonthMondays = getMondays(currentYear, currentMonth);
    const currentMondayIndex = currentMonthMondays.findIndex((monday) => {
      const nextMonday = new Date(monday);
      nextMonday.setDate(monday.getDate() + 7);
      return monday <= currentDate && currentDate < nextMonday;
    });

    // Calculate the x-position to scroll to based on the current week and month width
    const scrollToX =
      previousMonthsWidth +
      currentMondayIndex * widthPerWeek -
      window.innerWidth / 3.8 +
      widthPerWeek / 2;

    // Sync scrolling between the container and resources references
    const syncScroll = () => {
      if (resourcesRef.current) {
        resourcesRef.current.scrollLeft = containerRef.current.scrollLeft;
      }
    };

    // Scroll the main container and resources to the calculated position
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: scrollToX,
        behavior: "smooth",
      });
      containerRef.current.addEventListener("scroll", syncScroll);
    }

    if (resourcesRef.current) {
      resourcesRef.current.scrollTo({
        left: scrollToX,
        behavior: "smooth",
      });
    }

    // Cleanup event listener on component unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", syncScroll);
      }
    };
  }, [containerRef, resourcesRef, getMondays, getMonthsRange, widthPerWeek]);
};
