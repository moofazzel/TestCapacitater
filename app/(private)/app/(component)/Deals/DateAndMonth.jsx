import { getMondays, getMonthsRange } from "../../(utils)";

const DateAndMonth = ({ widthPerWeek }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // get before 5 months and after 8 months from the current date
  const monthsRange = getMonthsRange(currentMonth, currentYear, 5, 8);
  return (
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
            <div className="text-base font-medium text-center border border-l-0 bg-color10 border-color6 text-color03">
              {`${new Date(year, month).toLocaleString("default", {
                month: "short",
              })} ${year}`}
            </div>
            <div className="relative flex justify-end">
              {mondays.map((monday, i) => {
                const nextMonday = new Date(monday);
                nextMonday.setDate(monday.getDate() + 7);
                const isCurrentWeek =
                  monday <= currentDate && currentDate < nextMonday;
                return (
                  <div
                    key={i}
                    style={{ width: `${widthPerWeek}px` }}
                    className={` bg-white  relative h-full flex items-end`}
                  >
                    <span className="-ml-2.5 flex justify-center text-center w-5  px-1 rounded ">
                      {" "}
                      {monday.getDate()}
                    </span>
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

export default DateAndMonth;
