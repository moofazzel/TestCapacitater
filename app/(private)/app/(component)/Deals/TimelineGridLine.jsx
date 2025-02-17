import { getMondays, getMonthsRange } from "../../(utils)";

const TimelineGridLine = ({ widthPerWeek }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // get before 5 months and after 8 months from the current date
  const monthsRange = getMonthsRange(currentMonth, currentYear, 3, 8);

  return (
    <div className="flex border border-t-0 border-l-0 border-dashed border-color5">
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
                    style={{ width: `${widthPerWeek}px` }}
                    className={`text-center  border-r border-color05 relative h-full flex items-end justify-center`}
                  >
                    {isCurrentWeek && (
                      <div
                        style={{
                          width: "3px",
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
  );
};

export default TimelineGridLine;
