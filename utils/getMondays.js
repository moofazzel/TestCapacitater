export const getMondays = (startYear, startMonth, numMonths) => {
  const mondays = [];
  for (let i = 0; i < numMonths; i++) {
    const month = (startMonth + i) % 12;
    const year = startYear + Math.floor((startMonth + i) / 12);
    const monthMondays = [];
    const date = new Date(year, month, 1);
    // Find the first Monday in the month
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }
    // Add all Mondays in the month to the array
    while (date.getMonth() === month) {
      monthMondays.push(
        new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "numeric",
        })
      );
      date.setDate(date.getDate() + 7);
    }
    mondays.push(monthMondays);
  }
  return mondays;
};
